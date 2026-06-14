'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Globe, Shield, XCircle, Copy, Tag, Clock,
  MapPin, Network, Building2, Link2, FileWarning,
  Server, Radar, Database, AlertTriangle, CheckCircle2,
  Activity, ShieldAlert, Brain, Target, Zap,
  TrendingUp, AlertCircle, ChevronDown, ChevronUp,
  Cpu, BarChart2, Info,
} from 'lucide-react'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard }       from '@/components/ui/glass-card'
import { Button }          from '@/components/ui/button'
import { Input }           from '@/components/ui/input'
import { cn }              from '@/lib/utils'

// ─── Type badge ───────────────────────────────────────────────────────────────
const IndicatorTypeBadge = ({ type }: { type?: string }) => {
  const styles: Record<string, { label: string; className: string }> = {
    ip:      { label: 'IP',      className: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
    domain:  { label: 'DOMAIN',  className: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
    url:     { label: 'URL',     className: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
    email:   { label: 'EMAIL',   className: 'bg-pink-500/20 text-pink-400 border border-pink-500/30' },
    md5:     { label: 'MD5',     className: 'bg-red-500/20 text-red-400 border border-red-500/30' },
    sha1:    { label: 'SHA1',    className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
    sha256:  { label: 'SHA256',  className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
    unknown: { label: 'UNKNOWN', className: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' },
  }
  const config = styles[type || 'unknown'] || styles.unknown
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', config.className)}>
      {config.label}
    </span>
  )
}

// ─── Severity badge ───────────────────────────────────────────────────────────
const SeverityBadge = ({ severity }: { severity: string }) => {
  const styles: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
    high:     'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    medium:   'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    low:      'bg-green-500/20 text-green-400 border border-green-500/30',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize', styles[severity] || styles.low)}>
      {severity}
    </span>
  )
}

// ─── Reputation meter ─────────────────────────────────────────────────────────
function ReputationMeter({ score }: { score: number }) {
  const s = score || 0
  const color  = s >= 85 ? 'text-red-500'    : s >= 65 ? 'text-orange-500' : s >= 40 ? 'text-yellow-500' : 'text-green-500'
  const stroke = s >= 85 ? 'stroke-red-500'  : s >= 65 ? 'stroke-orange-500' : s >= 40 ? 'stroke-yellow-500' : 'stroke-green-500'
  return (
    <div className="relative">
      <svg className="h-32 w-32 -rotate-90">
        <circle cx="64" cy="64" r="56" fill="none" strokeWidth="8" className="stroke-secondary" />
        <motion.circle cx="64" cy="64" r="56" fill="none" strokeWidth="8" strokeLinecap="round"
          className={stroke}
          strokeDasharray={`${(s / 100) * 352} 352`}
          initial={{ strokeDasharray: '0 352' }}
          animate={{ strokeDasharray: `${(s / 100) * 352} 352` }}
          transition={{ duration: 1 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-3xl font-bold', color)}>{s}</span>
        <span className="text-xs text-muted-foreground">/100</span>
      </div>
    </div>
  )
}

// ─── Metric card ──────────────────────────────────────────────────────────────
function MetricCard({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/40 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="break-all text-sm font-medium">{value ?? 'Unknown'}</p>
      </div>
    </div>
  )
}

// ─── Source row ───────────────────────────────────────────────────────────────
function SourceRow({ name, score, label, hit }: { name: string; score?: any; label?: string; hit: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 px-4 py-3">
      <div className="flex items-center gap-3">
        {hit
          ? <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
          : <XCircle      className="h-4 w-4 text-muted-foreground shrink-0" />
        }
        <span className="text-sm font-medium">{name}</span>
      </div>
      {hit && score !== undefined && (
        <span className={cn('text-xs font-semibold px-2 py-1 rounded',
          Number(score) >= 80 ? 'bg-red-500/20 text-red-400' :
          Number(score) >= 50 ? 'bg-orange-500/20 text-orange-400' :
          Number(score) >= 20 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
        )}>
          {label || score}
        </span>
      )}
      {!hit && <span className="text-xs text-muted-foreground">No data</span>}
    </div>
  )
}

// ─── ML Prediction card ───────────────────────────────────────────────────────
function MLPredictionCard({ result }: any) {
  const [showReasoning, setShowReasoning] = useState(true)

  const mlScore    = result?.ml_score       ?? 0
  const fpProb     = result?.fp_probability ?? 100
  const confidence = result?.confidence     ?? 'Low'
  const reasoning  = result?.reasoning      ?? ''
  const topSignals = result?.top_signals    ?? []
  const modelUsed  = result?.model_used     ?? 'unknown'
  const severity   = result?.severity       ?? 'low'
  const isXGBoost  = modelUsed === 'xgboost_cicids'

  // Source data from API
  const vt    = result?.virustotal
  const abuse = result?.abuseipdb
  const otx   = result?.otx
  const mb    = result?.malwarebazaar
  const uh    = result?.urlhaus

  const severityColor: Record<string, string> = {
    critical: 'text-red-400', high: 'text-orange-400',
    medium:   'text-yellow-400', low: 'text-green-400',
  }

  const weightBadge: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
    high:     'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    medium:   'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    low:      'bg-green-500/20 text-green-400 border border-green-500/30',
  }

  return (
    <div className="rounded-2xl border border-primary/30 bg-secondary/10 overflow-hidden">

      {/* ── Header banner ── */}
      <div className="flex items-center justify-between bg-primary/10 px-6 py-4 border-b border-primary/20">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">ML BASED PREDICTION</span>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary font-mono">
                {isXGBoost ? 'XGBoost · CICIDS 2017+2018' : modelUsed}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Trained on 1,041,269 real network flows · 96.84% accuracy · ROC-AUC 0.9876
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isXGBoost
            ? <CheckCircle2 className="h-4 w-4 text-green-400" />
            : <AlertCircle  className="h-4 w-4 text-yellow-400" />
          }
          <span className="text-xs text-muted-foreground">{isXGBoost ? 'Model active' : 'Fallback mode'}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">

        {/* ── Score row ── */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Score */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-secondary/20 p-5 gap-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">ML Threat Score</p>
            <div className={cn('text-6xl font-bold', severityColor[severity] || 'text-green-400')}>
              {mlScore}
            </div>
            <p className="text-xs text-muted-foreground">/100</p>
            <div className="w-full rounded-full bg-secondary h-2 mt-1">
              <motion.div
                className={cn('h-2 rounded-full',
                  severity === 'critical' ? 'bg-red-500' :
                  severity === 'high'     ? 'bg-orange-500' :
                  severity === 'medium'   ? 'bg-yellow-500' : 'bg-green-500'
                )}
                initial={{ width: 0 }}
                animate={{ width: `${mlScore}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <SeverityBadge severity={severity} />
          </div>

          {/* Confidence + FP */}
          <div className="rounded-xl border border-border bg-secondary/20 p-5 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Model Confidence</p>
              <p className={cn('text-3xl font-bold', severityColor[severity] || 'text-green-400')}>{confidence}</p>
              <p className="text-xs text-muted-foreground mt-1">Classification certainty</p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">False Positive Probability</p>
              <p className="text-2xl font-bold text-muted-foreground">{fpProb}%</p>
              <p className="text-xs text-muted-foreground mt-1">Lower = more confident threat</p>
            </div>
          </div>

          {/* Verdict */}
          <div className="rounded-xl border border-border bg-secondary/20 p-5 flex flex-col justify-center gap-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">ML Verdict</p>
            <div className={cn('text-2xl font-bold', mlScore >= 50 ? 'text-red-400' : 'text-green-400')}>
              {mlScore >= 50 ? '⚠ MALICIOUS' : '✓ BENIGN'}
            </div>
            <p className="text-xs text-muted-foreground">
              {mlScore >= 85 ? 'Immediate action required' :
               mlScore >= 65 ? 'High priority investigation' :
               mlScore >= 40 ? 'Monitor closely' :
               'Likely safe — low risk'}
            </p>
          </div>
        </div>

        {/* ── Data sources fed into ML ── */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Database className="h-3 w-3" /> API Sources fed into ML model
          </p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <SourceRow
              name="VirusTotal"
              hit={!!vt}
              score={vt?.malicious}
              label={vt ? `${vt.malicious} malicious / ${vt.harmless} harmless` : undefined}
            />
            <SourceRow
              name="AbuseIPDB"
              hit={!!abuse}
              score={abuse?.risk_score}
              label={abuse ? `${abuse.risk_score}% abuse confidence · ${abuse.reports} reports` : undefined}
            />
            <SourceRow
              name="AlienVault OTX"
              hit={!!otx}
              score={otx?.pulse_count}
              label={otx ? `${otx.pulse_count} threat pulses` : undefined}
            />
            <SourceRow name="MalwareBazaar" hit={!!mb} />
            <SourceRow name="URLHaus"       hit={!!uh} />
          </div>
        </div>

        {/* ── Top signals ── */}
        {topSignals.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <AlertTriangle className="h-3 w-3" /> Top signals driving this score
            </p>
            <div className="space-y-2">
              {topSignals.map((sig: any, i: number) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-secondary/20 px-4 py-3">
                  <span className={cn('mt-0.5 shrink-0 rounded border px-2 py-0.5 text-xs font-semibold', weightBadge[sig.weight] || weightBadge.low)}>
                    {sig.weight?.toUpperCase()}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-primary">{sig.source}</p>
                    <p className="text-sm text-muted-foreground">{sig.signal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AI Reasoning ── */}
        {reasoning && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="flex w-full items-center justify-between px-4 py-3 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">AI Reasoning — Why this score?</span>
              </div>
              {showReasoning
                ? <ChevronUp   className="h-4 w-4 text-muted-foreground" />
                : <ChevronDown className="h-4 w-4 text-muted-foreground" />
              }
            </button>
            <AnimatePresence>
              {showReasoning && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 pb-4 border-t border-primary/20">
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-4 font-mono">
                      {reasoning}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Result card ──────────────────────────────────────────────────────────────
function ResultCard({ result }: { result: Record<string, any> }) {
  const iocType  = typeof result?.ioc_type === 'string' ? result.ioc_type.toLowerCase() : 'unknown'
  const score    = result?.ml_score ?? result?.risk_score ?? 0
  const severity = result?.severity ?? (score >= 85 ? 'critical' : score >= 65 ? 'high' : score >= 40 ? 'medium' : 'low')
  const vt       = result?.virustotal
  const abuse    = result?.abuseipdb

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

      {/* ── ML Prediction — FIRST and most prominent ── */}
      <MLPredictionCard result={result} />

      {/* ── IOC Summary ── */}
      <GlassCard>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex flex-col items-center justify-center lg:border-r lg:border-border lg:pr-8">
            <ReputationMeter score={score} />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="mb-3 flex items-center gap-2 flex-wrap">
                <IndicatorTypeBadge type={iocType} />
                <SeverityBadge severity={severity} />
              </div>
              <div className="flex items-center gap-3">
                <code className="break-all text-xl font-semibold md:text-2xl">
                  {String(result?.ioc || 'Unknown IOC')}
                </code>
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0"
                  onClick={() => navigator.clipboard.writeText(String(result?.ioc || ''))}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard icon={Shield}      label="ML Risk Score"   value={score} />
              <MetricCard icon={TrendingUp}  label="FP Probability"  value={`${result?.fp_probability ?? 0}%`} />
              <MetricCard icon={MapPin}      label="Country"         value={result?.country} />
              <MetricCard icon={Clock}       label="Searched By"     value={result?.searched_by} />
              <MetricCard icon={FileWarning} label="Abuse Reports"   value={abuse?.reports} />
              <MetricCard icon={Building2}   label="ISP"             value={abuse?.isp} />
              <MetricCard icon={Globe}       label="Usage Type"      value={abuse?.usage_type} />
              <MetricCard icon={Link2}       label="Domain"          value={abuse?.domain} />
            </div>
            {/* VT tags */}
            {Array.isArray(vt?.tags) && vt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {vt.tags.map((tag: string) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                    <Tag className="h-3 w-3" />{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* ── VirusTotal ── */}
      {vt && typeof vt === 'object' && (
        <GlassCard title="VirusTotal Intelligence" subtitle={`Source: ${vt.source || 'VirusTotal'} · Multi-engine malware scanning`}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={AlertTriangle} label="Malicious engines"  value={vt.malicious} />
            <MetricCard icon={AlertCircle}   label="Suspicious engines" value={vt.suspicious} />
            <MetricCard icon={CheckCircle2}  label="Harmless engines"   value={vt.harmless} />
            <MetricCard icon={BarChart2}     label="Reputation score"   value={vt.reputation} />
            <MetricCard icon={Network}       label="ASN"                value={vt.asn} />
            <MetricCard icon={Building2}     label="AS Owner"           value={vt.as_owner} />
            <MetricCard icon={MapPin}        label="Country"            value={vt.country} />
            <MetricCard icon={Clock}         label="Last analysis"      value={vt.last_analysis_date ?? 'Recent'} />
          </div>
        </GlassCard>
      )}

      {/* ── AbuseIPDB ── */}
      {abuse && typeof abuse === 'object' && (
        <GlassCard title="AbuseIPDB Intelligence" subtitle={`Source: ${abuse.source || 'AbuseIPDB'} · Community abuse reporting`}>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={Shield}        label="Abuse Confidence"  value={`${abuse.risk_score}%`} />
            <MetricCard icon={FileWarning}   label="Total Reports"     value={abuse.reports} />
            <MetricCard icon={Building2}     label="ISP"               value={abuse.isp} />
            <MetricCard icon={Globe}         label="Usage Type"        value={abuse.usage_type} />
            <MetricCard icon={Link2}         label="Domain"            value={abuse.domain} />
            <MetricCard icon={MapPin}        label="Country"           value={abuse.country} />
            <MetricCard icon={Network}       label="Status"            value={abuse.status} />
            <MetricCard icon={Clock}         label="Last Reported"     value={abuse.last_reported ? new Date(abuse.last_reported).toLocaleDateString() : 'Unknown'} />
          </div>
        </GlassCard>
      )}

      {/* ── OTX ── */}
      {result?.otx && typeof result.otx === 'object' && (
        <GlassCard title="AlienVault OTX Intelligence" subtitle="Source: AlienVault OTX · Threat intelligence enrichment">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={Radar}    label="Pulse Count" value={result.otx.pulse_count} />
            <MetricCard icon={Shield}   label="Reputation"  value={result.otx.reputation} />
            <MetricCard icon={MapPin}   label="Country"     value={result.otx.country} />
            <MetricCard icon={Database} label="ASN"         value={result.otx.asn} />
          </div>
        </GlassCard>
      )}

      {/* ── MalwareBazaar ── */}
      {result?.malwarebazaar && typeof result.malwarebazaar === 'object' && (
        <GlassCard title="MalwareBazaar Intelligence" subtitle="Source: MalwareBazaar · Malware sample enrichment">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={FileWarning} label="File Name"  value={result.malwarebazaar.file_name} />
            <MetricCard icon={Database}    label="File Type"  value={result.malwarebazaar.file_type} />
            <MetricCard icon={Shield}      label="Signature"  value={result.malwarebazaar.signature} />
            <MetricCard icon={Activity}    label="Reporter"   value={result.malwarebazaar.reporter} />
          </div>
        </GlassCard>
      )}

      {/* ── URLHaus ── */}
      {result?.urlhaus && typeof result.urlhaus === 'object' && (
        <GlassCard title="URLHaus Intelligence" subtitle="Source: URLHaus · Malicious URL analysis">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={ShieldAlert} label="Threat"   value={result.urlhaus.threat} />
            <MetricCard icon={Globe}       label="Host"     value={result.urlhaus.host} />
            <MetricCard icon={Network}     label="Status"   value={result.urlhaus.url_status} />
            <MetricCard icon={Activity}    label="Reporter" value={result.urlhaus.reporter} />
          </div>
        </GlassCard>
      )}

    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function IOCSearchPage() {
  const [query,        setQuery]        = useState('')
  const [searchResult, setSearchResult] = useState<Record<string, any> | null>(null)
  const [isSearching,  setIsSearching]  = useState(false)
  const [hasSearched,  setHasSearched]  = useState(false)
  const [error,        setError]        = useState('')

  const handleSearch = async () => {
    if (!query.trim()) return
    try {
      setIsSearching(true)
      setHasSearched(true)
      setError('')
      const token    = localStorage.getItem('token')
      const response = await fetch(
        `http://127.0.0.1:8000/ioc/search?ioc=${encodeURIComponent(query.trim())}`,
        { method: 'GET', headers: { Authorization: `Bearer ${token}` } }
      )
      if (!response.ok) throw new Error('IOC not found or unsupported type')
      const data = await response.json()
      console.log('IOC SEARCH RESULT:', data)
      setSearchResult(data || null)
    } catch (err: any) {
      setError(err.message)
      setSearchResult(null)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const quickSearchExamples = [
    { value: '185.220.101.47',                   icon: Server },
    { value: 'http://testphp.vulnweb.com',        icon: Globe },
    { value: '44d88612fea8a8f36de82e1278abb02f', icon: FileWarning },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">IOC Search</h1>
          <p className="mt-1 text-muted-foreground">Search and analyze indicators of compromise with ML-powered threat detection</p>
        </div>

        <GlassCard>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search IP, domain, URL, hash, email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-14 pl-12 text-base"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching} className="h-14 px-8 text-base">
              {isSearching ? 'Analyzing...' : 'Search'}
            </Button>
          </div>
          {!hasSearched && (
            <div className="mt-5 border-t border-border pt-5">
              <p className="text-xs text-muted-foreground mb-3">Quick examples:</p>
              <div className="flex flex-wrap gap-3">
                {quickSearchExamples.map((ex) => (
                  <button key={ex.value} onClick={() => setQuery(ex.value)}
                    className="inline-flex items-center gap-2 rounded-lg bg-secondary/50 px-4 py-2 text-sm transition-colors hover:bg-secondary">
                    <ex.icon className="h-4 w-4 text-primary" />
                    <span className="font-mono">{ex.value}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        <AnimatePresence mode="wait">
          {isSearching && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Shield className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Running ML analysis...</p>
            </div>
          )}
          {!isSearching && searchResult && <ResultCard result={searchResult} />}
          {!isSearching && error && (
            <div className="flex flex-col items-center justify-center py-20">
              <XCircle className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">No Results Found</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  )
}