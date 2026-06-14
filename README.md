<div align="center">

# 🛡️ SentinelX

### Enterprise-Grade Cyber Threat Intelligence & AI-Powered SOC Platform

<img src="https://img.shields.io/badge/Cybersecurity-SOC%20Platform-00F5FF?style=for-the-badge&logo=shield&logoColor=black" />
<img src="https://img.shields.io/badge/XGBoost-ML%20Model-FF6B35?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/CICIDS-2017%2B2018-purple?style=for-the-badge" />
<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/Next.js-Frontend-000000?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/WebSockets-Live%20Telemetry-ff4d4d?style=for-the-badge" />
<img src="https://img.shields.io/badge/MITRE-ATT%26CK-red?style=for-the-badge" />
<img src="https://img.shields.io/badge/PDF-Reporting-orange?style=for-the-badge" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />

---

### Enterprise-grade cybersecurity intelligence platform with **ML-powered threat detection**, IOC analysis, threat correlation, watchlists, MITRE ATT&CK mapping, SOC analytics, PDF intelligence reporting, and websocket-powered threat telemetry.

</div>

---

## 📌 Overview

SentinelX is a full-stack real-time cybersecurity intelligence and SOC simulation platform built for threat monitoring, IOC investigation, cyber threat analytics, and intelligence reporting.

The platform integrates **machine learning threat classification** trained on 1M+ real network flows, multiple threat intelligence APIs, live IOC analysis, risk scoring, MITRE ATT&CK mapping, websocket-powered telemetry, analytics dashboards, watchlist monitoring, and automated PDF intelligence reporting into a unified SOC-style environment.

SentinelX simulates real-world Security Operations Center (SOC) workflows used in enterprise cybersecurity infrastructures.

---

## 🤖 ML-Powered Threat Detection (NEW)

SentinelX now includes a **hybrid XGBoost machine learning pipeline** for autonomous IOC threat classification.

### Model Details

| Property | Value |
|---|---|
| Model | XGBoost Classifier |
| Training Dataset | CICIDS 2017 + 2018 (merged) |
| Training Samples | 1,041,269 network flows |
| Test Accuracy | **96.84%** |
| ROC-AUC Score | **0.9876** |
| F1 Score | **0.9262** |
| Features | 20 network flow features |
| False Positive Reduction | 68% vs rule-based baseline |

### How It Works

```
IOC Submitted
     │
     ▼
Threat Intel APIs (VirusTotal + AbuseIPDB + OTX + MalwareBazaar + URLHaus)
     │
     ▼
Feature Extraction (22 features mapped from API signals)
     │
     ▼
XGBoost ML Model → Raw Malicious Probability (0–1)
     │
     ▼
Hybrid Override Layer (definitive API signals boost score)
     │
     ▼
Final Score + Severity + Confidence + AI Reasoning
```

### Hybrid Scoring Rules

| Signal | Score Override |
|---|---|
| MalwareBazaar or URLHaus hit | 97% → CRITICAL |
| AbuseIPDB ≥ 90% + Tor exit node | 92% → CRITICAL |
| AbuseIPDB ≥ 90% | 88% → CRITICAL |
| VirusTotal ≥ 20 malicious engines | 90% → CRITICAL |
| VirusTotal ≥ 10 malicious engines | 75% → HIGH |
| All sources clean | Capped at 15% → LOW |

### ML Output Fields

Every IOC search now returns:
```json
{
  "ml_score": 0.92,
  "ml_score_pct": 92,
  "fp_probability": 0.08,
  "fp_probability_pct": 8,
  "severity": "critical",
  "confidence": "Very High",
  "reasoning": "IOC '185.220.101.47' classified as MALICIOUS with 92% confidence. AbuseIPDB: 100% abuse confidence — 539 reports. ISP is a known Tor exit node. VirusTotal: 15 engines flagged as malicious.",
  "top_signals": [...],
  "model_used": "xgboost_cicids"
}
```

---

## ✨ Core Features

✅ **ML-Powered IOC Threat Classification** (XGBoost, 96.84% accuracy)  
✅ **AI Reasoning Traces** (plain-English explanation of every decision)  
✅ **Hybrid Threat Scoring** (ML + direct API signal overrides)  
✅ IOC Intelligence Engine (IP, Domain, URL, Hash, Email)  
✅ Threat Correlation System  
✅ MITRE ATT&CK Mapping  
✅ Real-Time WebSocket Telemetry  
✅ SOC Analytics Dashboard  
✅ Threat Intelligence API Integrations (5 sources)  
✅ Watchlist Monitoring System  
✅ PDF Intelligence Reporting  
✅ Live Threat Activity Feed  
✅ Threat Severity Classification  
✅ Historical IOC Tracking  
✅ Multi-Source Threat Aggregation  

---

## ⚡ Tech Stack

### Frontend
- **Next.js** — React framework with App Router
- **TypeScript** — Type-safe development
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations
- **Recharts** — Analytics charts
- **ShadCN UI** — Component library
- **Lucide Icons** — Icon set

### Backend
- **FastAPI** — REST + WebSocket API server
- **Python 3.11** — Core language
- **SQLAlchemy** — ORM
- **WebSockets** — Real-time telemetry
- **JWT + OAuth2** — Authentication
- **ReportLab** — PDF generation

### Machine Learning
- **XGBoost** — Gradient boosted classifier
- **scikit-learn** — Preprocessing + evaluation
- **pandas / numpy** — Data engineering
- **SHAP** — Model explainability
- **CICIDS 2017+2018** — Training dataset (2.4GB, 1M+ flows)

### Database
- **PostgreSQL** — Primary database

### Threat Intelligence APIs
- VirusTotal API
- AlienVault OTX API
- MalwareBazaar API
- URLHaus API
- AbuseIPDB API
- NVD CVE API

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│              Frontend                   │
│           Next.js + TSX                 │
│  IOC Search │ Analytics │ Watchlists    │
└──────────────────┬──────────────────────┘
                   │ REST API + WebSockets
┌──────────────────▼──────────────────────┐
│              Backend                    │
│         FastAPI + SQLAlchemy            │
└──────────────────┬──────────────────────┘
                   │
     ┌─────────────▼─────────────┐
     │      ML Triage Layer      │
     │  XGBoost + Hybrid Override│
     │  96.84% accuracy          │
     └─────────────┬─────────────┘
                   │
     ┌─────────────▼─────────────┐
     │       PostgreSQL          │
     │        Database           │
     └─────────────┬─────────────┘
                   │
┌──────────────────▼────────────────────────────────┐
│           Threat Intelligence APIs                │
│  VirusTotal • OTX • MalwareBazaar • URLHaus       │
│  AbuseIPDB • NVD CVE                              │
└───────────────────────────────────────────────────┘
```

---

## 🛰️ Threat Intelligence Modules

### IOC Intelligence Engine
Analyze:
- IP addresses
- Domains
- URLs
- Malware hashes (MD5, SHA1, SHA256)
- Email indicators

Features:
- **ML threat scoring (XGBoost)**
- **AI reasoning trace**
- IOC enrichment from 5 sources
- Geo intelligence
- IOC history tracking
- Multi-source intelligence aggregation

---

### 🧠 Threat Correlation Engine
Correlates indicators using:
- IOC similarity analysis
- Rule-based attack mapping
- Threat aggregation logic
- MITRE ATT&CK techniques
- Severity inference

---

### 🔴 Real-Time WebSocket Telemetry
Live infrastructure supporting:
- Live SOC activity feeds
- Instant IOC broadcasts
- Real-time telemetry streaming
- Dashboard synchronization
- Event broadcasting architecture

---

### 📊 SOC Analytics Dashboard
Real-time cybersecurity analytics:
- Threat distribution
- IOC severity analytics
- Attack category visualization
- Country-based threat analytics
- 24-hour activity monitoring
- Dynamic chart rendering

---

### 🛡️ Watchlist Monitoring
Track suspicious infrastructure and malicious indicators:
- Add/remove IOC watchlists
- Active/inactive monitoring
- Persistent IOC tracking
- Threat match checking

---

### 📄 Intelligence Reporting
Generate downloadable reports including:
- IOC details + ML threat score
- AI reasoning trace
- Threat severity scoring
- MITRE ATT&CK mappings
- Threat intelligence sources
- Analyst notes

Exports: **PDF intelligence reports**

---

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/Fy1zN/Sentinel-X.git
cd Sentinel-X
```

### 2. Frontend Setup
```bash
npm install
npm run dev
# Runs on http://localhost:3000
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt
uvicorn app.main:app --reload
# Runs on http://127.0.0.1:8000
```

### 4. ML Model Setup
The XGBoost model files go in `backend/ml/`:
```
backend/ml/
├── model.pkl           ← trained XGBoost model
├── scaler.pkl          ← StandardScaler
└── feature_names.json  ← feature list
```

To retrain the model on CICIDS 2017+2018:
```bash
# In Google Colab — see ml/train.py
python ml/train.py
```

---

## 🔐 Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost/sentinelx

# Threat Intelligence APIs
VIRUSTOTAL_API_KEY=your_key
OTX_API_KEY=your_key
ABUSEIPDB_API_KEY=your_key

# Auth
JWT_SECRET_KEY=your_secret
```

---

## 📚 API Documentation

FastAPI Swagger Docs:
```
http://127.0.0.1:8000/docs
```

---

## 🎯 Project Highlights

- **ML threat classification** — XGBoost trained on 1M+ real CICIDS flows
- **96.84% accuracy** on held-out test set
- **AI reasoning** — plain-English explanation for every IOC verdict
- **Hybrid scoring** — ML + definitive API signal overrides
- Full-stack cybersecurity platform
- Real-time SOC simulation architecture
- Enterprise dashboard design
- WebSocket-powered telemetry
- MITRE ATT&CK integration
- Threat intelligence aggregation from 5 APIs
- PDF intelligence reporting
- IOC investigation workflows

---

## 🔮 Future Enhancements

- [ ] LangGraph AI investigation agent
- [ ] SIEM integrations (Splunk, Microsoft Sentinel)
- [ ] Sigma rule generation
- [ ] STIX/TAXII support
- [ ] Threat actor attribution
- [ ] Malware sandbox integration
- [ ] Live threat notifications
- [ ] Docker deployment
- [ ] Kubernetes orchestration
- [ ] RBAC authorization
- [ ] Fine-tuned LLM for SOC report generation
- [ ] Behavioral biometric continuous authentication

---

## 🛡️ Security Features

- JWT Authentication
- OAuth2 Authentication
- ML-powered IOC Risk Scoring
- Threat Intelligence Aggregation
- Real-Time WebSocket Monitoring
- Persistent Investigation Logging
- SOC-style Threat Monitoring
- False Positive Reduction (68% vs baseline)

---

## 💡 Use Cases

SentinelX can be used for:

- SOC workflow simulations
- Cybersecurity final year / capstone projects
- Threat intelligence demonstrations
- Blue-team environments
- IOC investigations
- Security research
- Cybersecurity hackathons
- ML in cybersecurity research
- Threat analytics demonstrations

---

## 👨‍💻 Author

**Krish Malhotra**

Cybersecurity • Threat Intelligence • AI/ML • Full-Stack Development

GitHub: [https://github.com/Fy1zN](https://github.com/Fy1zN)

---

## 📜 License

This project is licensed under the **MIT License**.
