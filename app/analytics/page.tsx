'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Target,
  Shield,
  Calendar,
  Globe,
  AlertTriangle,
  Server,
  FileWarning,
  Link2,
  Mail,
  Clock,
  Radar,
  Activity,
} from 'lucide-react'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts'

// --- Strict TypeScript Interfaces matching FastAPI API Schemas ---
interface DashboardStats {
  total_searches: number
  active_iocs: number
  malicious_iocs: number
  clean_iocs: number
  critical_iocs: number
  medium_iocs: number
  high_iocs: number
  low_iocs: number
  unique_countries: number
  average_risk_score: number
}

interface CountryMetric {
  country: string
  count: number
}

interface StatusMetric {
  status: string
  count: number
}

interface AttackCategoryMetric {
  name: string; // "Ransomware" | "Phishing" | "C2 Activity" | "Data Exfil" | "Recon"
  value: number
}

interface HourlyActivityMetric {
  time: string // "HH:00"
  threats: number
  alerts: number
}

interface LiveSocLog {
  title: string
  description: string
  user: string
  time: string // "hh:mm AM/PM"
  color: string // "text-red-400" | "text-orange-400" etc.
}

const COLORS = [
  '#06b6d4', // Cyan
  '#22c55e', // Green
  '#facc15', // Yellow
  '#f97316', // Orange
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#ef4444', // Red
]

export default function AnalyticsPage() {
  // --- Component Local State Hooks ---
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [countries, setCountries] = useState<CountryMetric[]>([])
  const [statusData, setStatusData] = useState<StatusMetric[]>([])
  const [activityData, setActivityData] = useState<HourlyActivityMetric[]>([])
  const [attackTypes, setAttackTypes] = useState<AttackCategoryMetric[]>([])
  const [socLogs, setSocLogs] = useState<LiveSocLog[]>([])
  
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // --- Optimized Memoized Data formatters for Recharts Layouts ---
  const formattedStatusData = useMemo(() => 
    statusData.map((item) => ({
      name: item.status,
      value: item.count,
    })), [statusData]
  )

  const formattedCountryData = useMemo(() => 
    countries.map((item) => ({
      name: item.country,
      value: item.count,
    })), [countries]
  )

  // --- Resilient Network Sync Processing Layer ---
  const fetchDashboardData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setErrorMsg('Authorization credentials missing from browser store.')
        return
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }

      const backendEndpoints = [
        { key: 'stats', url: 'http://127.0.0.1:8000/dashboard/stats' },
        { key: 'countries', url: 'http://127.0.0.1:8000/dashboard/countries' },
        { key: 'statusData', url: 'http://127.0.0.1:8000/dashboard/status-distribution' },
        { key: 'activityData', url: 'http://127.0.0.1:8000/dashboard/activity-24h' },
        { key: 'attackTypes', url: 'http://127.0.0.1:8000/dashboard/attack-categories' },
        { key: 'socLogs', url: 'http://127.0.0.1:8000/dashboard/soc-logs' },
      ]

      // Execute all 6 matching endpoints concurrently with Fault Isolation
      const queryPayloads = await Promise.allSettled(
        backendEndpoints.map(endpoint => 
          fetch(endpoint.url, { headers }).then(async (res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            return res.json()
          })
        )
      )

      const operationalFailures: string[] = []

      queryPayloads.forEach((payload, index) => {
        const key = backendEndpoints[index].key
        
        if (payload.status === 'fulfilled') {
          if (key === 'stats') setStats(payload.value)
          if (key === 'countries') setCountries(payload.value)
          if (key === 'statusData') setStatusData(payload.value)
          if (key === 'activityData') setActivityData(payload.value)
          if (key === 'attackTypes') setAttackTypes(payload.value)
          if (key === 'socLogs') setSocLogs(payload.value)
        } else {
          operationalFailures.push(key)
          console.error(`Endpoint syncing break context [${key}]:`, payload.reason)
        }
      })

      setLastUpdated(new Date().toLocaleTimeString())

      if (operationalFailures.length > 0) {
        setErrorMsg(`Partial sync degradation: Failed queries on [${operationalFailures.join(', ')}]`)
      } else {
        setErrorMsg(null)
      }

    } catch (err: any) {
      console.error('Critical operational dashboard crash:', err)
      setErrorMsg('Unexpected network configuration error identified.')
    }
  }, [])

  // --- Safe Recursive Loop Execution Setup ---
  useEffect(() => {
    let loopTimeoutId: NodeJS.Timeout

    const lifecycleWorker = async () => {
      await fetchDashboardData()
      loopTimeoutId = setTimeout(lifecycleWorker, 30000) // Enforces clean 30s delay intervals
    }

    lifecycleWorker()

    return () => clearTimeout(loopTimeoutId)
  }, [fetchDashboardData])

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Security Operations Center
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time threat monitoring and intelligence overview
            </p>
            {errorMsg && (
              <p className="text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-md mt-2 w-fit">
                ⚠️ Sync Notice: {errorMsg}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last updated: {lastUpdated || 'Initial data ingestion sync...'}
            </div>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Live Analytics
            </Button>
            <Button variant="outline">Export</Button>
          </div>
        </div>

        {/* KPI STATS CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-cyan-500/30 bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Threats Detected</p>
                <h2 className="text-3xl font-bold mt-2">{stats?.total_searches ?? 0}</h2>
                <p className="text-sm text-red-500 mt-2">+12.5% vs last week</p>
              </div>
              <Shield className="h-8 w-8 text-cyan-400" />
            </div>
          </div>

          <div className="rounded-2xl border border-yellow-500/30 bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active IOCs</p>
                <h2 className="text-3xl font-bold mt-2">{stats?.active_iocs ?? 0}</h2>
                <p className="text-sm text-yellow-500 mt-2">Threat indicators</p>
              </div>
              <Target className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="rounded-2xl border border-red-500/30 bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
                <h2 className="text-3xl font-bold mt-2">{stats?.critical_iocs ?? 0}</h2>
                <p className="text-sm text-red-500 mt-2">Immediate attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="rounded-2xl border border-green-500/30 bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Risk Score</p>
                <h2 className="text-3xl font-bold mt-2">{stats?.average_risk_score ?? 0}</h2>
                <p className="text-sm text-green-500 mt-2">Scale: 0 - 100</p>
              </div>
              <Radar className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* MAIN ANALYSIS CHARTS ROW */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* AREA CHART - THREAT TRENDS */}
          <GlassCard className="lg:col-span-2" title="Threat Trends" subtitle="24h hourly metric distribution">
            <div className="h-[350px]">
              {activityData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground italic">No trends data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Area type="monotone" dataKey="threats" stroke="#06b6d4" fillOpacity={1} fill="url(#colorThreats)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>

          {/* PIE CHART - ATTACK CATEGORIES */}
          <GlassCard title="Attack Categories" subtitle="Distribution classified by system rules">
            <div className="h-[350px]">
              {attackTypes.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground italic">No category data identified.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attackTypes}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                    >
                      {attackTypes.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px', color: '#a1a1aa', paddingLeft: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>
        </div>

        {/* SECONDARY ROW */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* LINE CHART - 24H TRACKER */}
          <GlassCard title="24h Activity Tracker" subtitle="Threat metrics against high risk critical alerts">
            <div className="h-[320px]">
              {activityData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground italic">No historical timelines loaded.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="threats" stroke="#06b6d4" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="alerts" stroke="#f97316" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>

          {/* REAL TIME SOC LOGS FEED */}
          <GlassCard title="SOC Operational Activities" subtitle="Real-time analysis stream">
            <div className="space-y-5 max-h-[320px] overflow-y-auto pr-2">
              {socLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-10">No recent database events recorded.</p>
              ) : (
                socLogs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex gap-4 border-b border-white/5 pb-3 last:border-0"
                  >
                    <div className="mt-1">
                      <Activity className={`h-5 w-5 ${log.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{log.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{log.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-zinc-500">
                        <span>Operator: {log.user}</span>
                        <span>Time: {log.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* BOTTOM METRICS CONTAINER */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* BAR CHART - GEOLOCATION ORIGINS */}
          <GlassCard title="Geographical Threat Origins" subtitle="Top source origins aggregated by lookup logs">
            <div className="h-[350px]">
              {formattedCountryData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground italic">No location telemetry available.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedCountryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {formattedCountryData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>

          {/* PIE CHART - THREAT STATUS STATUSES */}
          <GlassCard title="Threat Classification Statuses" subtitle="Status metrics representation">
            <div className="h-[350px]">
              {formattedStatusData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground italic">No classifications identified.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formattedStatusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={5}
                    >
                      {formattedStatusData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="middle"
                      align="right"
                      layout="vertical"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '13px', color: '#a1a1aa', paddingLeft: '15px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </GlassCard>
        </div>

      </div>
    </DashboardLayout>
  )
}