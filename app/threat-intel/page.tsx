'use client'

import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'

import {
  Shield,
  Activity,
  Globe,
  TrendingUp,
  Link2,
  Mail,
  FileWarning,
  Radar,
  Database,
  AlertTriangle,
  RefreshCw,
  Server,
} from 'lucide-react'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'

export default function ThreatIntelPage() {

  const [liveThreats, setLiveThreats] =
    useState<any[]>([])

  const [internalFeed, setInternalFeed] =
    useState<any[]>([])

  const [loading, setLoading] =
    useState(true)

  const [syncing, setSyncing] =
    useState(false)

  const [lastUpdated, setLastUpdated] =
    useState<string>('')

  const [feedStatus, setFeedStatus] =
    useState('Active')

  const [livePulse, setLivePulse] =
    useState(false)

  useEffect(() => {

    fetchThreatFeeds()

    const interval = window.setInterval(() => {

      fetchThreatFeeds()

      setLivePulse(true)

      setTimeout(() => {

        setLivePulse(false)

      }, 1000)

    }, 5000)

    return () => clearInterval(interval)

  }, [])

  const fetchThreatFeeds = async () => {

    try {

      setSyncing(true)

      const token =
        localStorage.getItem('token')

      const headers = {

        Authorization: `Bearer ${token}`,

      }

      // LIVE FEED
      const liveRes = await fetch(

        'http://127.0.0.1:8000/threats/live-feed',

        {

          headers,
          cache: 'no-store',

        }

      )

      // INTERNAL FEED
      const internalRes = await fetch(

        'http://127.0.0.1:8000/threats/feed',

        {

          headers,
          cache: 'no-store',

        }

      )

      if (!liveRes.ok) {

        throw new Error(
          'Live feed API failed'
        )

      }

      if (!internalRes.ok) {

        throw new Error(
          'Internal feed API failed'
        )

      }

      const liveData =
        await liveRes.json()

      const internalData =
        await internalRes.json()

      console.log(
        'LIVE FEED RESPONSE:',
        JSON.stringify(
          liveData,
          null,
          2
        )
      )

      console.log(
        'INTERNAL FEED:',
        internalData
      )

      const safeLiveData =
        Array.isArray(liveData)
          ? [...liveData]
          : []

      const safeInternalData =
        Array.isArray(internalData)
          ? [...internalData]
          : []

      setLiveThreats(
        safeLiveData
      )

      setInternalFeed(
        safeInternalData
      )

      if (
        safeLiveData.length === 0 &&
        safeInternalData.length === 0
      ) {

        setFeedStatus('Offline')

      } else {

        setFeedStatus('Active')

      }

      setLastUpdated(
        new Date().toLocaleTimeString()
      )

    } catch (err) {

      console.error(
        'THREAT FEED ERROR:',
        err
      )

      if (
        liveThreats.length === 0 &&
        internalFeed.length === 0
      ) {

        setFeedStatus('Offline')

      }

    } finally {

      setLoading(false)

      setSyncing(false)

    }

  }

  const criticalThreats =
    liveThreats.filter(
      (t) =>
        t.status?.toLowerCase() ===
        'critical'
    ).length

  const suspiciousThreats =
    liveThreats.filter(
      (t) =>
        t.status?.toLowerCase() ===
        'suspicious'
    ).length

  const maliciousCount =
    liveThreats.filter(
      (t) =>
        t.status?.toLowerCase() ===
        'malicious'
    ).length

  const countries =
    new Set(
      liveThreats
        .map(
          (t) => t.country
        )
        .filter(Boolean)
    ).size

  const getIOCIcon = (
    type: string
  ) => {

    if (!type) {

      return Server

    }

    switch (
      type.toLowerCase()
    ) {

      case 'ip':
        return Globe

      case 'domain':
        return Link2

      case 'url':
        return Link2

      case 'email':
        return Mail

      case 'md5':
      case 'sha1':
      case 'sha256':
        return FileWarning

      default:
        return Server

    }

  }

  const getSeverityColor = (
    status: string
  ) => {

    switch (
      status?.toLowerCase()
    ) {

      case 'critical':

        return 'bg-red-500/20 text-red-400 border-red-500/30'

      case 'malicious':

        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'

      case 'suspicious':

        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'

      default:

        return 'bg-green-500/20 text-green-400 border-green-500/30'

    }

  }

  const feedSources = [

    {

      name: 'AbuseIPDB',

      indicators:
        liveThreats.length,

      reliability:
        feedStatus === 'Active'
          ? '98%'
          : '0%',

      status: feedStatus,

      icon: Shield,

    },

    {

      name: 'AlienVault OTX',

      indicators:
        liveThreats.length,

      reliability:
        feedStatus === 'Active'
          ? '99%'
          : '0%',

      status: feedStatus,

      icon: Radar,

    },

    {

      name: 'Internal SOC Feed',

      indicators:
        internalFeed.length,

      reliability:
        feedStatus === 'Active'
          ? '100%'
          : '0%',

      status: feedStatus,

      icon: Activity,

    },

    {

      name: 'Threat Correlation',

      indicators:
        liveThreats.length +
        internalFeed.length,

      reliability:
        feedStatus === 'Active'
          ? '96%'
          : '0%',

      status: feedStatus,

      icon: Database,

    },

  ]

  return (

    <DashboardLayout>

      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-2xl font-bold tracking-tight">

              Threat Intelligence

            </h1>

            <p className="text-muted-foreground">

              Aggregated threat intelligence from multi-source IOC feeds

            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="text-right">

              <p className="text-xs text-muted-foreground">

                Last Updated

              </p>

              <p className="text-sm font-medium text-primary">

                {lastUpdated || 'Waiting for feed'}

              </p>

            </div>

            <Button
              variant="outline"
              onClick={fetchThreatFeeds}
              disabled={syncing}
            >

              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  syncing
                    ? 'animate-spin'
                    : ''
                }`}
              />

              {

                syncing
                  ? 'Syncing...'
                  : 'Sync Feeds'

              }

            </Button>

          </div>

        </div>

        {/* OFFLINE WARNING */}
        {

          feedStatus === 'Offline' && (

            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">

              <div className="flex items-center gap-3 text-red-400">

                <AlertTriangle className="h-5 w-5" />

                <span className="font-medium">

                  Threat Intelligence Feeds Offline

                </span>

              </div>

            </div>

          )

        }

        {/* TOP STATS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">

            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ${
              livePulse
                ? 'animate-pulse'
                : ''
            }`}>

              <Shield className="h-5 w-5 text-primary" />

            </div>

            <div>

              <p className="text-2xl font-bold">

                {

                  liveThreats.filter(
                    (t) => t.ioc
                  ).length

                }

              </p>

              <p className="text-xs text-muted-foreground">

                Active IOCs

              </p>

            </div>

          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">

              <TrendingUp className="h-5 w-5 text-red-400" />

            </div>

            <div>

              <p className="text-2xl font-bold">

                {criticalThreats}

              </p>

              <p className="text-xs text-muted-foreground">

                Critical

              </p>

            </div>

          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">

              <AlertTriangle className="h-5 w-5 text-yellow-400" />

            </div>

            <div>

              <p className="text-2xl font-bold">

                {suspiciousThreats}

              </p>

              <p className="text-xs text-muted-foreground">

                Suspicious

              </p>

            </div>

          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">

              <Radar className="h-5 w-5 text-orange-400" />

            </div>

            <div>

              <p className="text-2xl font-bold">

                {maliciousCount}

              </p>

              <p className="text-xs text-muted-foreground">

                Malicious

              </p>

            </div>

          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">

              <Globe className="h-5 w-5 text-cyan-400" />

            </div>

            <div>

              <p className="text-2xl font-bold">

                {countries}

              </p>

              <p className="text-xs text-muted-foreground">

                Countries

              </p>

            </div>

          </div>

        </div>

        {/* FEED CARDS */}
        <GlassCard
          title="Intelligence Feeds"
          subtitle="Realtime multi-source threat intelligence monitoring"
        >

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            {

              feedSources.map(
                (feed, index) => {

                  const Icon =
                    feed.icon

                  return (

                    <motion.div
                      key={feed.name}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.05,
                      }}
                      className="rounded-xl border border-border bg-secondary/20 p-4 hover:bg-secondary/30 transition-all"
                    >

                      <div className="flex items-start justify-between mb-4">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">

                          <Icon className={`h-5 w-5 text-primary ${
                            syncing
                              ? 'animate-pulse'
                              : ''
                          }`} />

                        </div>

                        <span className={`
                          rounded-full px-2 py-1 text-xs border
                          ${
                            feed.status === 'Active'
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }
                        `}>

                          {feed.status}

                        </span>

                      </div>

                      <div className="space-y-2">

                        <h3 className="font-semibold">

                          {feed.name}

                        </h3>

                        <p className="text-sm text-muted-foreground">

                          {feed.indicators.toLocaleString()} indicators

                        </p>

                        <div className="flex items-center justify-between text-xs">

                          <span className="text-muted-foreground">

                            Reliability

                          </span>

                          <span className="text-primary font-medium">

                            {feed.reliability}

                          </span>

                        </div>

                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">

                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width:
                                feed.reliability,
                            }}
                          />

                        </div>

                      </div>

                    </motion.div>

                  )

                }
              )

            }

          </div>

        </GlassCard>

        {/* LIVE THREAT FEED */}
        <GlassCard
          title="Global Threat Feed"
          subtitle="Realtime intelligence from AbuseIPDB, OTX, MalwareBazaar and URLHaus"
        >

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-border text-left text-xs text-muted-foreground">

                  <th className="pb-3 pr-4">

                    Live

                  </th>

                  <th className="pb-3 pr-4">

                    Type

                  </th>

                  <th className="pb-3 pr-4">

                    Indicator

                  </th>

                  <th className="pb-3 pr-4">

                    Severity

                  </th>

                  <th className="pb-3 pr-4">

                    Country

                  </th>

                  <th className="pb-3 pr-4">

                    Reports

                  </th>

                  <th className="pb-3">

                    Last Seen

                  </th>

                </tr>

              </thead>

              <tbody>

                {

                  liveThreats.map(
                    (
                      threat,
                      index
                    ) => {

                      const Icon =
                        getIOCIcon(
                          threat.ioc_type || 'unknown'
                        )

                      return (

                        <motion.tr
                          key={`${threat.ioc}-${index}`}
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          transition={{
                            delay:
                              index * 0.03,
                          }}
                          className="border-b border-border/50 hover:bg-secondary/10 transition-colors"
                        >

                          <td className="py-4 pr-4">

                            <div className={`h-3 w-3 rounded-full ${
                              livePulse
                                ? 'bg-green-400 animate-pulse'
                                : 'bg-cyan-400'
                            }`} />

                          </td>

                          <td className="py-4 pr-4">

                            <div className="flex items-center gap-2">

                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">

                                <Icon className="h-4 w-4 text-primary" />

                              </div>

                              <span className="uppercase text-xs">

                                {threat.ioc_type || 'unknown'}

                              </span>

                            </div>

                          </td>

                          <td className="py-4 pr-4 font-medium">

                            {threat.ioc}

                          </td>

                          <td className="py-4 pr-4">

                            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${
                              getSeverityColor(
                                threat.status
                              )
                            }`}>

                              {threat.status}

                            </span>

                          </td>

                          <td className="py-4 pr-4 text-muted-foreground">

                            {threat.country || 'Unknown'}

                          </td>

                          <td className="py-4 pr-4 text-primary font-semibold">

                            {
                              threat.total_reports ||
                              threat.reports ||
                              0
                            }

                          </td>

                          <td className="py-4 text-muted-foreground">

                            {new Date().toLocaleDateString()}

                          </td>

                        </motion.tr>

                      )

                    }
                  )

                }

              </tbody>

            </table>

            {

              !loading &&
              liveThreats.length === 0 && (

                <div className="py-10 text-center text-muted-foreground">

                  No live threats found

                </div>

              )

            }

          </div>

        </GlassCard>

      </div>

    </DashboardLayout>

  )

}