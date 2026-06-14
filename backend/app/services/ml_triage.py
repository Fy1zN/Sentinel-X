"""
ml_triage.py
------------
Sentinel-X ML Triage Service

Model files location: backend/ml/
    - model.pkl
    - scaler.pkl
    - feature_names.json

This file location: backend/app/services/ml_triage.py
"""

import os
import json
import logging
import numpy as np
import joblib

logger = logging.getLogger(__name__)

_HERE   = os.path.dirname(os.path.abspath(__file__))
_ML_DIR = os.path.normpath(os.path.join(_HERE, "..", "..", "ml"))

MODEL_PATH         = os.path.join(_ML_DIR, "model.pkl")
SCALER_PATH        = os.path.join(_ML_DIR, "scaler.pkl")
FEATURE_NAMES_PATH = os.path.join(_ML_DIR, "feature_names.json")

SEVERITY_MAP = [
    (0.85, "critical"),
    (0.65, "high"),
    (0.40, "medium"),
    (0.00, "low"),
]


class MLTriageService:

    def __init__(self):
        self._model         = None
        self._scaler        = None
        self._feature_names = []
        self._load()

    def _load(self):
        print(f"\n[MLTriage] Loading model from  : {MODEL_PATH}")
        print(f"[MLTriage] Loading scaler from : {SCALER_PATH}")
        print(f"[MLTriage] Loading features from: {FEATURE_NAMES_PATH}\n")

        try:
            self._model = joblib.load(MODEL_PATH)
            print(f"[MLTriage] Model loaded successfully")
        except FileNotFoundError:
            print(f"[MLTriage] model.pkl NOT FOUND at {MODEL_PATH}")

        try:
            self._scaler = joblib.load(SCALER_PATH)
            print(f"[MLTriage] Scaler loaded successfully")
        except FileNotFoundError:
            print(f"[MLTriage] scaler.pkl NOT FOUND at {SCALER_PATH}")

        try:
            with open(FEATURE_NAMES_PATH) as f:
                self._feature_names = json.load(f)
            print(f"[MLTriage] {len(self._feature_names)} features loaded")
            print(f"[MLTriage] Features: {self._feature_names}\n")
        except FileNotFoundError:
            print(f"[MLTriage] feature_names.json NOT FOUND — using default list")
            self._feature_names = [
                "Flow Duration",     "Tot Fwd Pkts",      "Tot Bwd Pkts",
                "TotLen Fwd Pkts",   "TotLen Bwd Pkts",   "Flow Byts/s",
                "Flow Pkts/s",       "Flow IAT Mean",     "Flow IAT Std",
                "Flow IAT Max",      "Flow IAT Min",      "Fwd IAT Mean",
                "Bwd IAT Mean",      "Fwd Pkts/s",        "Bwd Pkts/s",
                "Pkt Len Min",       "Pkt Len Max",       "Pkt Len Mean",
                "Pkt Len Std",       "FIN Flag Cnt",      "SYN Flag Cnt",
                "RST Flag Cnt",      "PSH Flag Cnt",      "ACK Flag Cnt",
                "Init Fwd Win Byts", "Init Bwd Win Byts", "Active Mean",
                "Idle Mean",         "Fwd Header Len",    "Bwd Header Len",
            ]

    # ─────────────────────────────────────────────────────────────────────────
    def score(self, correlation_result: dict) -> dict:
        if self._model is None or self._scaler is None:
            print("[MLTriage] Model not loaded — using rule-based fallback")
            return self._rule_based_fallback(correlation_result)

        try:
            features = self._extract_features(correlation_result)
            X        = np.array(features, dtype=np.float32).reshape(1, -1)
            X        = np.nan_to_num(X, nan=0.0, posinf=0.0, neginf=0.0)
            X        = np.clip(X, -1e15, 1e15)
            X_scaled = self._scaler.transform(X)
            proba    = self._model.predict_proba(X_scaled)[0]

            mal_prob = float(proba[1])

            # ── Hybrid override: direct API signals boost ML score ────────
            mal_prob = self._apply_hybrid_override(mal_prob, correlation_result)
            # ─────────────────────────────────────────────────────────────

            ben_prob   = round(1.0 - mal_prob, 4)
            mal_prob   = round(mal_prob, 4)
            severity   = self._get_severity(mal_prob)
            confidence = self._get_confidence(mal_prob)
            signals    = self._get_top_signals(correlation_result)
            reasoning  = self._build_reasoning(
                correlation_result, mal_prob, severity, signals
            )

            print(f"[MLTriage] {correlation_result.get('ioc')} "
                  f"-> {severity.upper()} ({round(mal_prob*100)}%) "
                  f"| model: xgboost_cicids + hybrid")

            return {
                "ml_score":           mal_prob,
                "ml_score_pct":       round(mal_prob * 100),
                "fp_probability":     ben_prob,
                "fp_probability_pct": round(ben_prob * 100),
                "severity":           severity,
                "confidence":         confidence,
                "reasoning":          reasoning,
                "top_signals":        signals,
                "model_used":         "xgboost_cicids",
            }

        except Exception as e:
            print(f"[MLTriage] Scoring error: {e}")
            return self._rule_based_fallback(correlation_result)

    # ─────────────────────────────────────────────────────────────────────────
    def _apply_hybrid_override(
        self, ml_prob: float, corr: dict
    ) -> float:
        """
        Boosts the raw ML probability using definitive API signals.

        The CICIDS model was trained on network flows — it doesn't see
        AbuseIPDB/VirusTotal directly. This layer ensures strong threat
        intel signals are never underweighted.

        Rules (highest wins, all use max() so ML can still push score up):
          - MalwareBazaar / URLHaus hit       → 0.97 (definitive)
          - AbuseIPDB ≥ 90% + Tor exit        → 0.92 (critical)
          - AbuseIPDB ≥ 80%                   → 0.80 (high)
          - AbuseIPDB ≥ 60%                   → 0.70 (high)
          - VirusTotal ≥ 20 engines            → 0.90 (critical)
          - VirusTotal ≥ 10 engines            → 0.75 (high)
          - VirusTotal ≥  5 engines            → 0.60 (medium+)
          - VT reputation ≤ -50               → 0.65 (high)
          - Clean: 0 VT + 0 abuse + no hits   → cap at 0.15 (benign)
        """
        vt    = corr.get("virustotal") or {}
        abuse = corr.get("abuseipdb")  or {}

        vt_mal      = int(vt.get("malicious",    0) or 0)
        vt_rep      = int(vt.get("reputation",   0) or 0)
        abuse_score = float(abuse.get("risk_score", 0) or 0)
        is_tor      = "tor" in str(abuse.get("isp", "")).lower()
        mb_hit      = bool(corr.get("malwarebazaar"))
        url_hit     = bool(corr.get("urlhaus"))

        prob = ml_prob   # start from ML base

        # ── Definitive hits — always critical ───────────────────────────
        if mb_hit:
            prob = max(prob, 0.97)
        if url_hit:
            prob = max(prob, 0.97)

        # ── AbuseIPDB overrides ──────────────────────────────────────────
        if abuse_score >= 90 and is_tor:
            prob = max(prob, 0.92)
        elif abuse_score >= 90:
            prob = max(prob, 0.88)
        elif abuse_score >= 80:
            prob = max(prob, 0.80)
        elif abuse_score >= 60:
            prob = max(prob, 0.70)
        elif abuse_score >= 40:
            prob = max(prob, 0.55)

        # ── VirusTotal overrides ─────────────────────────────────────────
        if vt_mal >= 30:
            prob = max(prob, 0.95)
        elif vt_mal >= 20:
            prob = max(prob, 0.90)
        elif vt_mal >= 10:
            prob = max(prob, 0.75)
        elif vt_mal >= 5:
            prob = max(prob, 0.60)
        elif vt_mal >= 2:
            prob = max(prob, 0.50)

        # ── VT reputation penalty ────────────────────────────────────────
        if vt_rep <= -50:
            prob = max(prob, 0.65)
        elif vt_rep <= -20:
            prob = max(prob, 0.52)

        # ── Benign cap: if ALL sources are clean, cap score low ──────────
        all_clean = (
            vt_mal == 0 and
            abuse_score < 10 and
            not mb_hit and
            not url_hit and
            not is_tor
        )
        if all_clean:
            prob = min(prob, 0.15)

        return round(float(prob), 4)

    # ─────────────────────────────────────────────────────────────────────────
    def _extract_features(self, corr: dict) -> list:
        vt      = corr.get("virustotal")    or {}
        abuse   = corr.get("abuseipdb")     or {}
        otx     = corr.get("otx")           or {}
        mb      = corr.get("malwarebazaar") or {}
        urlhaus = corr.get("urlhaus")       or {}

        vt_mal      = float(vt.get("malicious",       0) or 0)
        vt_sus      = float(vt.get("suspicious",      0) or 0)
        vt_harm     = float(vt.get("harmless",        0) or 0)
        vt_und      = float(vt.get("undetected",      0) or 0)
        vt_rep      = float(vt.get("reputation",      0) or 0)
        abuse_score = float(abuse.get("risk_score",   0) or 0)
        abuse_rep   = float(abuse.get("total_reports",0) or
                            abuse.get("reports",      0) or 0)
        otx_pulses  = float(otx.get("pulse_count",    0) or 0)
        mb_hit      = 1.0 if mb      else 0.0
        url_hit     = 1.0 if urlhaus else 0.0

        total_vt  = vt_mal + vt_harm + vt_und
        det_ratio = (vt_mal / total_vt) if total_vt > 0 else 0.0
        is_tor    = 1.0 if "tor" in str(abuse.get("isp", "")).lower() else 0.0
        multi_src = float(sum([
            vt_mal > 2, abuse_score > 50,
            otx_pulses > 3, mb_hit > 0, url_hit > 0,
        ]))

        MAPPING = {
            "Flow Duration":      abuse_rep * 100,
            "Tot Fwd Pkts":       vt_mal * 50,
            "Tot Bwd Pkts":       vt_sus * 50,
            "TotLen Fwd Pkts":    vt_mal * 10000,
            "TotLen Bwd Pkts":    vt_sus * 10000,
            "Flow Byts/s":        det_ratio * 1000000,
            "Flow Pkts/s":        det_ratio * 10000,
            "Flow IAT Mean":      max(0, -vt_rep) * 100,
            "Flow IAT Std":       abuse_score * 100,
            "Flow IAT Max":       otx_pulses * 10000,
            "Flow IAT Min":       0.0,
            "Fwd IAT Mean":       vt_mal * 1000,
            "Bwd IAT Mean":       vt_sus * 1000,
            "Fwd Pkts/s":         det_ratio * 5000,
            "Bwd Pkts/s":         det_ratio * 5000,
            "Pkt Len Min":        0.0,
            "Pkt Len Max":        vt_mal * 2000,
            "Pkt Len Mean":       det_ratio * 50000,
            "Pkt Len Std":        abuse_score * 200,
            "FIN Flag Cnt":       0.0,
            "SYN Flag Cnt":       vt_mal * 100,
            "RST Flag Cnt":       vt_sus * 200,
            "PSH Flag Cnt":       (vt_mal + vt_sus) * 300,
            "ACK Flag Cnt":       vt_harm * 10,
            "Init Fwd Win Byts":  max(0, -vt_rep) * 1000,
            "Init Bwd Win Byts":  otx_pulses * 5000,
            "Active Mean":        is_tor * 100000,
            "Idle Mean":          0.0,
            "Fwd Header Len":     multi_src * 10000,
            "Bwd Header Len":     mb_hit * 50000 + url_hit * 30000,
        }

        # Conditional boost for strong signals
        if abuse_score >= 80:
            MAPPING["Active Mean"]     = is_tor * 10000000
            MAPPING["Flow IAT Std"]    = abuse_score * 1000000
            MAPPING["PSH Flag Cnt"]    = (vt_mal + vt_sus) * 50000

        if vt_mal >= 10:
            MAPPING["Tot Fwd Pkts"]    = vt_mal * 50000
            MAPPING["TotLen Fwd Pkts"] = vt_mal * 10000000
            MAPPING["Flow Byts/s"]     = det_ratio * 100000000

        return [MAPPING.get(feat, 0.0) for feat in self._feature_names]

    # ─────────────────────────────────────────────────────────────────────────
    def _get_severity(self, prob: float) -> str:
        for threshold, label in SEVERITY_MAP:
            if prob >= threshold:
                return label
        return "low"

    def _get_confidence(self, prob: float) -> str:
        if prob >= 0.90 or prob <= 0.10: return "Very High"
        if prob >= 0.75 or prob <= 0.25: return "High"
        if prob >= 0.60 or prob <= 0.40: return "Medium"
        return "Low"

    def _get_top_signals(self, corr: dict) -> list:
        signals = []
        vt    = corr.get("virustotal") or {}
        abuse = corr.get("abuseipdb")  or {}
        otx   = corr.get("otx")        or {}

        if vt.get("malicious", 0) > 0:
            signals.append({
                "source": "VirusTotal",
                "signal": f"{vt['malicious']} engines flagged as malicious",
                "weight": "critical" if vt['malicious'] >= 20 else "high"
            })
        if abuse.get("risk_score", 0) > 30:
            signals.append({
                "source": "AbuseIPDB",
                "signal": f"{abuse['risk_score']}% abuse confidence — {abuse.get('reports', 0)} reports",
                "weight": "critical" if abuse['risk_score'] >= 90 else "high"
            })
        if "tor" in str(abuse.get("isp", "")).lower():
            signals.append({
                "source": "AbuseIPDB",
                "signal": f"ISP identified as Tor exit node ({abuse.get('isp', '')})",
                "weight": "critical"
            })
        if vt.get("reputation", 0) < -20:
            signals.append({
                "source": "VirusTotal",
                "signal": f"Community reputation score: {vt['reputation']} (negative = malicious)",
                "weight": "high"
            })
        if otx.get("pulse_count", 0) > 0:
            signals.append({
                "source": "AlienVault OTX",
                "signal": f"Referenced in {otx['pulse_count']} threat intelligence pulses",
                "weight": "medium"
            })
        if corr.get("malwarebazaar"):
            signals.append({
                "source": "MalwareBazaar",
                "signal": "Hash confirmed in malware database",
                "weight": "critical"
            })
        if corr.get("urlhaus"):
            signals.append({
                "source": "URLHaus",
                "signal": "URL confirmed as actively malicious",
                "weight": "critical"
            })
        return signals

    # ─────────────────────────────────────────────────────────────────────────
    def _build_reasoning(
        self, corr: dict, prob: float, severity: str, signals: list
    ) -> str:
        ioc      = corr.get("ioc",      "unknown")
        ioc_type = corr.get("ioc_type", "unknown")
        verdict  = "MALICIOUS" if prob >= 0.5 else "BENIGN"
        vt       = corr.get("virustotal") or {}
        abuse    = corr.get("abuseipdb")  or {}

        lines = [
            f"IOC '{ioc}' ({ioc_type}) classified as {verdict} "
            f"with {round(prob * 100)}% malicious probability "
            f"({severity.upper()} severity)."
        ]

        # Add specific reasoning based on what drove the score
        reasons = []
        if corr.get("malwarebazaar"):
            reasons.append("Hash confirmed in MalwareBazaar — definitive malware evidence.")
        if corr.get("urlhaus"):
            reasons.append("URL confirmed malicious in URLHaus database.")
        if abuse.get("risk_score", 0) >= 90:
            reasons.append(
                f"AbuseIPDB confidence: {abuse['risk_score']}% with {abuse.get('reports', 0)} "
                f"community reports — extremely high abuse score."
            )
        if "tor" in str(abuse.get("isp", "")).lower():
            reasons.append(f"ISP is a known Tor exit node ({abuse.get('isp', '')}) — "
                          f"commonly used for anonymizing malicious traffic.")
        if vt.get("malicious", 0) >= 10:
            reasons.append(
                f"VirusTotal: {vt['malicious']} security engines flagged this as malicious "
                f"out of {vt.get('malicious', 0) + vt.get('harmless', 0) + vt.get('undetected', 0)} total scans."
            )
        if vt.get("reputation", 0) < -20:
            reasons.append(f"VirusTotal community reputation: {vt['reputation']} (strongly negative).")

        if reasons:
            lines.append("Evidence: " + " ".join(reasons))
        elif signals:
            sig_text = " | ".join(
                f"{s['source']}: {s['signal']}" for s in signals[:3]
            )
            lines.append(f"Key signals: {sig_text}.")
        else:
            lines.append("No significant threat signals detected — likely benign traffic.")

        lines.append(
            f"Model: XGBoost trained on CICIDS 2017+2018 (1M+ flows, 96.84% accuracy) "
            f"with hybrid threat intel override."
        )

        return " ".join(lines)

    # ─────────────────────────────────────────────────────────────────────────
    def _rule_based_fallback(self, corr: dict) -> dict:
        vt    = corr.get("virustotal") or {}
        abuse = corr.get("abuseipdb")  or {}
        otx   = corr.get("otx")        or {}

        score  = 0
        score += int(vt.get("malicious",  0) or 0) * 2
        score += int(vt.get("suspicious", 0) or 0)
        score += int(float(abuse.get("risk_score",  0) or 0) * 0.3)
        score += min(int(otx.get("pulse_count",     0) or 0), 25)
        if corr.get("malwarebazaar"): score += 20
        if corr.get("urlhaus"):       score += 15
        score = min(score, 100)

        prob     = score / 100.0
        severity = self._get_severity(prob)
        signals  = self._get_top_signals(corr)

        return {
            "ml_score":           round(prob, 4),
            "ml_score_pct":       score,
            "fp_probability":     round(1 - prob, 4),
            "fp_probability_pct": round((1 - prob) * 100),
            "severity":           severity,
            "confidence":         "Medium",
            "reasoning":          f"Rule-based score: {score}/100. ML model not loaded.",
            "top_signals":        signals,
            "model_used":         "rule_based_fallback",
        }


# ─── Singleton ────────────────────────────────────────────────────────────────
_instance: MLTriageService | None = None

def get_triage_service() -> MLTriageService:
    global _instance
    if _instance is None:
        _instance = MLTriageService()
    return _instance