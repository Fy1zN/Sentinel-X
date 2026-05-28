'use client'

import { useEffect, useMemo, useState } from 'react'

import { motion } from 'framer-motion'

import {
  Shield,
  AlertTriangle,
  Network,
  Target,
  Globe,
  Server,
  Activity,
  Search,
  Bug,
  Radar,
  Link2,
  Lock,
} from 'lucide-react'

import { DashboardLayout } from '@/components/layout/dashboard-layout'

import { GlassCard } from '@/components/ui/glass-card'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'


interface MitreTechnique {

  id: string

  name: string

}


interface CorrelationResponse {

  ioc: string

  ioc_type: string

  severity: string

  threat_score: number

  country?: string

  domain?: string

  isp?: string

  asn?: string

  usage_type?: string

  virustotal?: any

  abuseipdb?: any

  otx?: any

  malwarebazaar?: any

  urlhaus?: any

  mitre_attack?: MitreTechnique[]

}


function SeverityBadge({

  severity

}: {

  severity: string

}) {

  return (

    <div
      className={cn(

        'px-3 py-1 rounded-full text-xs font-semibold border w-fit uppercase tracking-wide',

        severity === 'critical' &&
          'bg-red-500/15 text-red-400 border-red-500/30',

        severity === 'high' &&
          'bg-orange-500/15 text-orange-400 border-orange-500/30',

        severity === 'medium' &&
          'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',

        severity === 'low' &&
          'bg-green-500/15 text-green-400 border-green-500/30'
      )}
    >
      {severity}
    </div>

  )

}


function ProviderCard({

  title,
  icon,
  active,
  children

}: {

  title: string

  icon: React.ReactNode

  active: boolean

  children: React.ReactNode

}) {

  return (

    <motion.div

      whileHover={{ scale: 1.02 }}

      className={cn(

        'rounded-2xl border p-5 transition-all',

        active
          ? 'border-cyan-500/30 bg-card'
          : 'border-border bg-card/40 opacity-60'
      )}
    >

      <div className="flex items-center justify-between mb-4">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
            {icon}
          </div>

          <div>

            <h3 className="font-semibold">
              {title}
            </h3>

            <p className="text-xs text-muted-foreground">
              {active ? 'Active Intelligence' : 'No Data'}
            </p>

          </div>

        </div>

        <div
          className={cn(

            'h-3 w-3 rounded-full',

            active
              ? 'bg-green-500 animate-pulse'
              : 'bg-muted'
          )}
        />

      </div>

      {children}

    </motion.div>

  )

}


function InfoRow({

  label,
  value

}: {

  label: string

  value?: any

}) {

  return (

    <div className="flex items-center justify-between text-sm">

      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="font-medium text-right max-w-[180px] truncate">
        {value || 'Unknown'}
      </span>

    </div>

  )

}


export default function CorrelationPage() {

  const [ioc, setIoc] = useState('185.220.101.45')

  const [loading, setLoading] = useState(false)

  const [result, setResult] =
    useState<CorrelationResponse | null>(null)

  const [error, setError] = useState('')


  // =========================================
  // IOC TYPE DETECTION
  // =========================================
  const detectIOCType = (value: string) => {

    const input = value.trim()

    // URL
    if (/^(http|https):\/\//i.test(input)) {
      return 'url'
    }

    // IPv4
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(input)) {
      return 'ip'
    }

    // SHA256
    if (/^[a-fA-F0-9]{64}$/.test(input)) {
      return 'sha256'
    }

    // SHA1
    if (/^[a-fA-F0-9]{40}$/.test(input)) {
      return 'sha1'
    }

    // MD5
    if (/^[a-fA-F0-9]{32}$/.test(input)) {
      return 'md5'
    }

    // DOMAIN
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(input)) {
      return 'domain'
    }

    return 'unknown'

  }


  // =========================================
  // ANALYZE IOC
  // =========================================
  const analyzeIOC = async () => {

    try {

      setLoading(true)

      setError('')

      const detectedType = detectIOCType(ioc)

      if (detectedType === 'unknown') {

        setError('Unsupported IOC type')

        setLoading(false)

        return

      }

      const response = await fetch(

        `http://127.0.0.1:8000/correlation/analyze?ioc=${encodeURIComponent(
          ioc
        )}&ioc_type=${detectedType}`,

        {

          method: 'POST',

        }

      )

      const data = await response.json()

      setResult(data)

    } catch (err) {

      console.error(err)

      setError('Failed to analyze IOC')

    } finally {

      setLoading(false)

    }

  }


  useEffect(() => {

    analyzeIOC()

  }, [])


  const activeSources = useMemo(() => {

    if (!result) return 0

    return [

      result.virustotal,
      result.abuseipdb,
      result.otx,
      result.malwarebazaar,
      result.urlhaus

    ].filter(Boolean).length

  }, [result])


  return (

    <DashboardLayout>

      <div className="space-y-6">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold tracking-tight">
              Threat Correlation
            </h1>

            <p className="text-muted-foreground mt-1">
              Multi-source IOC fusion and intelligence orchestration
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="relative">

              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <input

                value={ioc}

                onChange={(e) =>
                  setIoc(e.target.value)
                }

                placeholder="Enter IOC"

                className="h-11 w-[320px] rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none focus:border-cyan-500"

              />

            </div>

            <Button
              onClick={analyzeIOC}
              disabled={loading}
            >

              {loading ? 'Analyzing...' : 'Analyze'}

            </Button>

          </div>

        </div>


        {/* SUMMARY */}

        {result && (

          <div className="grid gap-4 lg:grid-cols-5">

            <GlassCard>

              <div className="flex items-center gap-3">

                <Shield className="h-5 w-5 text-cyan-400" />

                <div>

                  <p className="text-xs text-muted-foreground">
                    IOC Type
                  </p>

                  <p className="font-semibold uppercase">
                    {result.ioc_type}
                  </p>

                </div>

              </div>

            </GlassCard>

            <GlassCard>

              <div className="flex items-center gap-3">

                <AlertTriangle className="h-5 w-5 text-red-400" />

                <div>

                  <p className="text-xs text-muted-foreground">
                    Threat Score
                  </p>

                  <p className="text-2xl font-bold">
                    {result.threat_score}
                  </p>

                </div>

              </div>

            </GlassCard>

            <GlassCard>

              <div className="flex items-center gap-3">

                <Globe className="h-5 w-5 text-blue-400" />

                <div>

                  <p className="text-xs text-muted-foreground">
                    Country
                  </p>

                  <p className="font-semibold">
                    {result.country || 'Unknown'}
                  </p>

                </div>

              </div>

            </GlassCard>

            <GlassCard>

              <div className="flex items-center gap-3">

                <Server className="h-5 w-5 text-orange-400" />

                <div>

                  <p className="text-xs text-muted-foreground">
                    ASN
                  </p>

                  <p className="font-semibold">
                    {result.asn || 'Unknown'}
                  </p>

                </div>

              </div>

            </GlassCard>

            <GlassCard>

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs text-muted-foreground mb-2">
                    Severity
                  </p>

                  <SeverityBadge
                    severity={result.severity}
                  />

                </div>

                <Activity className="h-6 w-6 text-cyan-400" />

              </div>

            </GlassCard>

          </div>

        )}


        {/* INTEL GRID */}

        {result && (

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">

            {/* VT */}

            <ProviderCard

              title="VirusTotal"

              icon={<Shield className="h-5 w-5 text-cyan-400" />}

              active={!!result.virustotal}

            >

              {result.virustotal && (

                <div className="space-y-3">

                  <InfoRow
                    label="Malicious"
                    value={result.virustotal.malicious}
                  />

                  <InfoRow
                    label="Suspicious"
                    value={result.virustotal.suspicious}
                  />

                  <InfoRow
                    label="Reputation"
                    value={result.virustotal.reputation}
                  />

                  <InfoRow
                    label="Country"
                    value={result.virustotal.country}
                  />

                </div>

              )}

            </ProviderCard>


            {/* ABUSE */}

            <ProviderCard

              title="AbuseIPDB"

              icon={<Radar className="h-5 w-5 text-red-400" />}

              active={!!result.abuseipdb}

            >

              {result.abuseipdb && (

                <div className="space-y-3">

                  <InfoRow
                    label="Risk Score"
                    value={result.abuseipdb.risk_score}
                  />

                  <InfoRow
                    label="Reports"
                    value={result.abuseipdb.reports}
                  />

                  <InfoRow
                    label="ISP"
                    value={result.abuseipdb.isp}
                  />

                  <InfoRow
                    label="Usage"
                    value={result.abuseipdb.usage_type}
                  />

                </div>

              )}

            </ProviderCard>


            {/* OTX */}

            <ProviderCard

              title="AlienVault OTX"

              icon={<Network className="h-5 w-5 text-purple-400" />}

              active={!!result.otx}

            >

              {result.otx && (

                <div className="space-y-3">

                  <InfoRow
                    label="Pulse Count"
                    value={result.otx.pulse_count}
                  />

                  <InfoRow
                    label="Country"
                    value={result.otx.country}
                  />

                  <InfoRow
                    label="ASN"
                    value={result.otx.asn}
                  />

                  <InfoRow
                    label="Reputation"
                    value={result.otx.reputation}
                  />

                </div>

              )}

            </ProviderCard>


            {/* MALWAREBAZAAR */}

            <ProviderCard

              title="MalwareBazaar"

              icon={<Bug className="h-5 w-5 text-orange-400" />}

              active={!!result.malwarebazaar}

            >

              {result.malwarebazaar && (

                <div className="space-y-3">

                  <InfoRow
                    label="File Name"
                    value={result.malwarebazaar.file_name}
                  />

                  <InfoRow
                    label="Signature"
                    value={result.malwarebazaar.signature}
                  />

                  <InfoRow
                    label="File Type"
                    value={result.malwarebazaar.file_type}
                  />

                  <InfoRow
                    label="Reporter"
                    value={result.malwarebazaar.reporter}
                  />

                </div>

              )}

            </ProviderCard>


            {/* URLHAUS */}

            <ProviderCard

              title="URLHaus"

              icon={<Link2 className="h-5 w-5 text-yellow-400" />}

              active={!!result.urlhaus}

            >

              {result.urlhaus && (

                <div className="space-y-3">

                  <InfoRow
                    label="Threat"
                    value={result.urlhaus.threat}
                  />

                  <InfoRow
                    label="Status"
                    value={result.urlhaus.url_status}
                  />

                  <InfoRow
                    label="Reporter"
                    value={result.urlhaus.reporter}
                  />

                </div>

              )}

            </ProviderCard>


            {/* MITRE */}

            <ProviderCard

              title="MITRE ATT&CK"

              icon={<Target className="h-5 w-5 text-red-400" />}

              active={
                !!result.mitre_attack?.length
              }

            >

              <div className="space-y-3">

                {result.mitre_attack?.map(

                  (technique) => (

                    <div

                      key={technique.id}

                      className="rounded-xl border border-border bg-secondary/20 p-3"

                    >

                      <div className="flex items-center justify-between">

                        <div>

                          <p className="font-semibold">
                            {technique.id}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {technique.name}
                          </p>

                        </div>

                        <Lock className="h-4 w-4 text-red-400" />

                      </div>

                    </div>

                  )

                )}

              </div>

            </ProviderCard>

          </div>

        )}


        {/* FOOTER ANALYSIS */}

        {result && (

          <GlassCard>

            <div className="flex items-start justify-between gap-4">

              <div>

                <h3 className="text-lg font-semibold mb-2">
                  Threat Verdict
                </h3>

                <p className="text-muted-foreground leading-relaxed">

                  This IOC was analyzed using a multi-source
                  intelligence correlation engine combining
                  VirusTotal, AbuseIPDB, AlienVault OTX,
                  MalwareBazaar, and URLHaus enrichment
                  pipelines.

                </p>

              </div>

              <div className="flex flex-col items-end gap-3">

                <SeverityBadge
                  severity={result.severity}
                />

                <div className="text-sm text-muted-foreground">

                  Active Sources:
                  <span className="ml-2 font-semibold text-foreground">
                    {activeSources}
                  </span>

                </div>

              </div>

            </div>

          </GlassCard>

        )}


        {/* ERROR */}

        {error && (

          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">

            {error}

          </div>

        )}

      </div>

    </DashboardLayout>

  )

}