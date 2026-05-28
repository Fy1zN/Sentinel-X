'use client'

import { useState } from 'react'
import {
  motion,
  AnimatePresence,
} from 'framer-motion'

import {
  Search,
  Globe,
  Shield,
  XCircle,
  Copy,
  Tag,
  Clock,
  MapPin,
  Network,
  Building2,
  Link2,
  FileWarning,
  Server,
  Radar,
  Database,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ShieldAlert,
  Mail,
} from 'lucide-react'

import { DashboardLayout } from '@/components/layout/dashboard-layout'

import { GlassCard } from '@/components/ui/glass-card'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'

interface ResultCardProps {
  result: Record<string, any>
}

const IndicatorTypeBadge = ({
  type,
}: {
  type?: string
}) => {

  const styles: Record<
    string,
    {
      label: string
      className: string
    }
  > = {

    ip: {
      label: 'IP',
      className:
        'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    },

    domain: {
      label: 'DOMAIN',
      className:
        'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    },

    url: {
      label: 'URL',
      className:
        'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    },

    email: {
      label: 'EMAIL',
      className:
        'bg-pink-500/20 text-pink-400 border border-pink-500/30',
    },

    md5: {
      label: 'MD5',
      className:
        'bg-red-500/20 text-red-400 border border-red-500/30',
    },

    sha1: {
      label: 'SHA1',
      className:
        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    },

    sha256: {
      label: 'SHA256',
      className:
        'bg-green-500/20 text-green-400 border border-green-500/30',
    },

    unknown: {
      label: 'UNKNOWN',
      className:
        'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    },

  }

  const config =
    styles[type || 'unknown'] ||
    styles.unknown

  return (

    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        config.className
      )}
    >

      {config.label}

    </span>

  )
}

const SeverityBadge = ({
  severity,
}: {
  severity: string
}) => {

  const styles: Record<
    string,
    string
  > = {

    critical:
      'bg-red-500/20 text-red-400 border border-red-500/30',

    high:
      'bg-orange-500/20 text-orange-400 border border-orange-500/30',

    medium:
      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',

    low:
      'bg-green-500/20 text-green-400 border border-green-500/30',

  }

  return (

    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize',
        styles[severity] ||
          styles.low
      )}
    >

      {severity}

    </span>

  )
}

function ReputationMeter({
  score,
}: {
  score: number
}) {

  const safeScore =
    score || 0

  const getColor = (
    score: number
  ) => {

    if (score >= 90)
      return 'text-red-500'

    if (score >= 70)
      return 'text-orange-500'

    if (score >= 40)
      return 'text-yellow-500'

    return 'text-green-500'
  }

  const getStroke = (
    score: number
  ) => {

    if (score >= 90)
      return 'stroke-red-500'

    if (score >= 70)
      return 'stroke-orange-500'

    if (score >= 40)
      return 'stroke-yellow-500'

    return 'stroke-green-500'
  }

  return (

    <div className="flex flex-col items-center gap-2">

      <div className="relative">

        <svg className="h-32 w-32 -rotate-90">

          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            strokeWidth="8"
            className="stroke-secondary"
          />

          <motion.circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={getStroke(
              safeScore
            )}
            strokeDasharray={`${(safeScore / 100) * 352} 352`}
            initial={{
              strokeDasharray:
                '0 352',
            }}
            animate={{
              strokeDasharray: `${(safeScore / 100) * 352} 352`,
            }}
            transition={{
              duration: 1,
            }}
          />

        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">

          <span
            className={cn(
              'text-3xl font-bold',
              getColor(
                safeScore
              )
            )}
          >

            {safeScore}

          </span>

          <span className="text-xs text-muted-foreground">

            /100

          </span>

        </div>

      </div>

    </div>

  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: any) {

  return (

    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/40 p-4">

      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">

        <Icon className="h-5 w-5 text-primary" />

      </div>

      <div className="min-w-0">

        <p className="text-xs text-muted-foreground">

          {label}

        </p>

        <p className="break-all text-sm font-medium">

          {value || 'Unknown'}

        </p>

      </div>

    </div>

  )
}

function ThreatAnalysisCard({
  result,
}: any) {

  const analysis =
    result?.threat_analysis

  if (!analysis)
    return null

  const severity =
    analysis?.severity ||
    'low'

  const finalScore =
    analysis?.final_score ||
    0

  return (

    <GlassCard
      title="Threat Analysis"
      subtitle="Aggregated threat intelligence verdict"
    >

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-secondary/20 p-6">

          <div
            className={cn(
              'text-5xl font-bold',
              severity ===
                'critical'
                ? 'text-red-500'
                : severity ===
                  'high'
                ? 'text-orange-500'
                : severity ===
                  'medium'
                ? 'text-yellow-500'
                : 'text-green-500'
            )}
          >

            {finalScore}

          </div>

          <p className="mt-2 text-muted-foreground">

            Threat Score

          </p>

        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-border bg-secondary/20 p-6">

          <div className="mb-4 flex items-center gap-3">

            <ShieldAlert className="h-6 w-6 text-primary" />

            <h3 className="text-lg font-semibold">

              Security Verdict

            </h3>

          </div>

          <SeverityBadge
            severity={severity}
          />

        </div>

        <div className="rounded-2xl border border-border bg-secondary/20 p-6">

          <div className="mb-5 flex items-center gap-3">

            <Radar className="h-6 w-6 text-primary" />

            <h3 className="text-lg font-semibold">

              Intelligence Sources

            </h3>

          </div>

          <div className="space-y-3">

            {[
              {
                label:
                  'AlienVault OTX',
                value:
                  result?.otx,
              },

              {
                label:
                  'MalwareBazaar',
                value:
                  result?.malwarebazaar,
              },

              {
                label:
                  'URLHaus',
                value:
                  result?.urlhaus,
              },

            ].map((source) => (

              <div
                key={
                  source.label
                }
                className="flex items-center justify-between"
              >

                <span className="text-sm">

                  {source.label}

                </span>

                {source.value ? (

                  <CheckCircle2 className="h-5 w-5 text-green-500" />

                ) : (

                  <XCircle className="h-5 w-5 text-muted-foreground" />

                )}

              </div>

            ))}

          </div>

        </div>

      </div>

    </GlassCard>

  )
}

function ResultCard({
  result,
}: ResultCardProps) {

  const normalizedIOCType =
    typeof result?.ioc_type ===
    'string'
      ? result.ioc_type.toLowerCase()
      : 'unknown'

  const score =
    result?.threat_analysis
      ?.final_score ??
    result?.risk_score ??
    0

  const severity =
    score >= 90
      ? 'critical'
      : score >= 70
      ? 'high'
      : score >= 40
      ? 'medium'
      : 'low'

  const copyIOC = () => {

    navigator.clipboard.writeText(
      String(
        result?.ioc || ''
      )
    )
  }

  return (

    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="space-y-6"
    >

      <ThreatAnalysisCard
        result={result}
      />

      <GlassCard>

        <div className="flex flex-col gap-8 lg:flex-row">

          <div className="flex flex-col items-center justify-center lg:border-r lg:border-border lg:pr-8">

            <ReputationMeter
              score={score}
            />

          </div>

          <div className="flex-1 space-y-6">

            <div>

              <div className="mb-3 flex items-center gap-2">

                <IndicatorTypeBadge
                  type={
                    normalizedIOCType
                  }
                />

                <SeverityBadge
                  severity={
                    severity
                  }
                />

              </div>

              <div className="flex items-center gap-3">

                <code className="break-all text-xl font-semibold leading-relaxed md:text-2xl">

                  {String(
                    result?.ioc ||
                      'Unknown IOC'
                  )}

                </code>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={
                    copyIOC
                  }
                >

                  <Copy className="h-4 w-4" />

                </Button>

              </div>

            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

              <MetricCard
                icon={Shield}
                label="Risk Score"
                value={score}
              />

              <MetricCard
                icon={MapPin}
                label="Country"
                value={
                  result?.country
                }
              />

              <MetricCard
                icon={Network}
                label="Status"
                value={
                  result?.status
                }
              />

              <MetricCard
                icon={Clock}
                label="Searched By"
                value={
                  result?.searched_by ||
                  'Unknown'
                }
              />

              <MetricCard
                icon={FileWarning}
                label="Reports"
                value={
                  result?.total_reports
                }
              />

              <MetricCard
                icon={Globe}
                label="Usage Type"
                value={
                  result?.usage_type
                }
              />

              <MetricCard
                icon={Building2}
                label="ISP"
                value={
                  result?.isp
                }
              />

              <MetricCard
                icon={Link2}
                label="Domain"
                value={
                  result?.domain
                }
              />

            </div>

            {Array.isArray(
              result?.tags
            ) &&
              result.tags
                .length > 0 && (

                <div className="flex flex-wrap gap-2">

                  {result.tags.map(
                    (
                      tag: string
                    ) => (

                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                      >

                        <Tag className="h-3 w-3" />

                        {tag}

                      </span>

                    )
                  )}

                </div>

              )}

          </div>

        </div>

      </GlassCard>

      {result?.otx &&
        typeof result.otx ===
          'object' && (

          <GlassCard
            title="AlienVault OTX Intelligence"
            subtitle="Threat intelligence enrichment"
          >

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

              <MetricCard
                icon={Radar}
                label="Pulse Count"
                value={
                  result.otx
                    .pulse_count
                }
              />

              <MetricCard
                icon={Shield}
                label="Reputation"
                value={
                  result.otx
                    .reputation
                }
              />

              <MetricCard
                icon={MapPin}
                label="Country"
                value={
                  result.otx
                    .country
                }
              />

              <MetricCard
                icon={Database}
                label="ASN"
                value={
                  result.otx
                    .asn
                }
              />

            </div>

          </GlassCard>

        )}

      {result?.malwarebazaar &&
        typeof result.malwarebazaar ===
          'object' && (

          <GlassCard
            title="MalwareBazaar Intelligence"
            subtitle="Malware sample enrichment"
          >

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

              <MetricCard
                icon={
                  FileWarning
                }
                label="File Name"
                value={
                  result
                    .malwarebazaar
                    .file_name
                }
              />

              <MetricCard
                icon={Database}
                label="File Type"
                value={
                  result
                    .malwarebazaar
                    .file_type
                }
              />

              <MetricCard
                icon={Shield}
                label="Signature"
                value={
                  result
                    .malwarebazaar
                    .signature
                }
              />

              <MetricCard
                icon={Activity}
                label="Reporter"
                value={
                  result
                    .malwarebazaar
                    .reporter
                }
              />

            </div>

          </GlassCard>

        )}

      {result?.urlhaus &&
        typeof result.urlhaus ===
          'object' && (

          <GlassCard
            title="URLHaus Intelligence"
            subtitle="Malicious URL analysis"
          >

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

              <MetricCard
                icon={
                  ShieldAlert
                }
                label="Threat"
                value={
                  result.urlhaus
                    .threat
                }
              />

              <MetricCard
                icon={Globe}
                label="Host"
                value={
                  result.urlhaus
                    .host
                }
              />

              <MetricCard
                icon={Network}
                label="Status"
                value={
                  result.urlhaus
                    .url_status
                }
              />

              <MetricCard
                icon={Activity}
                label="Reporter"
                value={
                  result.urlhaus
                    .reporter
                }
              />

            </div>

          </GlassCard>

        )}

    </motion.div>

  )
}

export default function IOCSearchPage() {

  const [query, setQuery] =
    useState('')

  const [
    searchResult,
    setSearchResult,
  ] = useState<
    Record<
      string,
      any
    > | null
  >(null)

  const [isSearching,
    setIsSearching,
  ] = useState(false)

  const [hasSearched,
    setHasSearched,
  ] = useState(false)

  const [error, setError] =
    useState('')

  const handleSearch =
    async () => {

      if (
        !query.trim()
      ) return

      try {

        setIsSearching(true)

        setHasSearched(true)

        setError('')

        const token =
          localStorage.getItem(
            'token'
          )

        const response =
          await fetch(

            `http://127.0.0.1:8000/ioc/search?ioc=${encodeURIComponent(query)}`,

            {

              method: 'GET',

              headers: {

                Authorization: `Bearer ${token}`,

              },

            }

          )

        if (
          !response.ok
        ) {

          throw new Error(
            'IOC not found'
          )

        }

        const data =
          await response.json()

        console.log(
          'IOC SEARCH RESULT:',
          data
        )

        setSearchResult(
          data || null
        )

      } catch (err: any) {

        console.error(
          err
        )

        setError(
          err.message
        )

        setSearchResult(
          null
        )

      } finally {

        setIsSearching(
          false
        )

      }

    }

  const handleKeyDown = (
    e: React.KeyboardEvent
  ) => {

    if (
      e.key ===
      'Enter'
    ) {

      handleSearch()

    }

  }

  const quickSearchExamples =
    [

      {
        value:
          '185.220.101.45',
        icon: Server,
      },

      {
        value:
          'http://testphp.vulnweb.com',
        icon: Globe,
      },

      {
        value:
          '44d88612fea8a8f36de82e1278abb02f',
        icon:
          FileWarning,
      },

    ]

  return (

    <DashboardLayout>

      <div className="space-y-6">

        <div>

          <h1 className="text-3xl font-bold tracking-tight">

            IOC Search

          </h1>

          <p className="mt-1 text-muted-foreground">

            Search and analyze indicators of compromise

          </p>

        </div>

        <GlassCard>

          <div className="flex flex-col gap-4 sm:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="text"
                placeholder="Search IP, domain, URL, hash, email..."
                value={query}
                onChange={(
                  e
                ) =>
                  setQuery(
                    e.target
                      .value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                className="h-14 pl-12 text-base"
              />

            </div>

            <Button
              onClick={
                handleSearch
              }
              disabled={
                isSearching
              }
              className="h-14 px-8 text-base"
            >

              {isSearching
                ? 'Searching...'
                : 'Search'}

            </Button>

          </div>

          {!hasSearched && (

            <div className="mt-5 border-t border-border pt-5">

              <div className="flex flex-wrap gap-3">

                {quickSearchExamples.map(
                  (
                    example
                  ) => (

                    <button
                      key={
                        example.value
                      }
                      onClick={() =>
                        setQuery(
                          example.value
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-secondary/50 px-4 py-2 text-sm transition-colors hover:bg-secondary"
                    >

                      <example.icon className="h-4 w-4 text-primary" />

                      <span className="font-mono">

                        {
                          example.value
                        }

                      </span>

                    </button>

                  )
                )}

              </div>

            </div>

          )}

        </GlassCard>

        <AnimatePresence mode="wait">

          {isSearching && (

            <div className="flex justify-center py-20">

              <Shield className="h-12 w-12 animate-spin text-primary" />

            </div>

          )}

          {!isSearching &&
            searchResult && (

              <ResultCard
                result={
                  searchResult
                }
              />

            )}

          {!isSearching &&
            error && (

              <div className="flex flex-col items-center justify-center py-20">

                <XCircle className="mb-4 h-12 w-12 text-muted-foreground" />

                <h3 className="mb-2 text-xl font-semibold">

                  No Results Found

                </h3>

                <p className="text-muted-foreground">

                  {error}

                </p>

              </div>

            )}

        </AnimatePresence>

      </div>

    </DashboardLayout>

  )
}