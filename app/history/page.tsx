'use client'

import { useEffect, useState } from 'react'

import { motion } from 'framer-motion'

import {
  History,
  Globe,
  ShieldAlert,
  Clock3,
  User,
} from 'lucide-react'

import { GlassCard } from '@/components/ui/glass-card'

export default function HistoryPage() {

  const [history, setHistory] =
    useState<any[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {

      const token =
        localStorage.getItem('token')

      const response = await fetch(
        'http://127.0.0.1:8000/history/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data =
        await response.json()

      console.log(data)

      setHistory(data)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (
    status: string
  ) => {

    switch (status?.toLowerCase()) {

      case 'critical':
        return 'text-red-500 border-red-500/30 bg-red-500/10'

      case 'malicious':
        return 'text-red-400 border-red-400/30 bg-red-400/10'

      case 'dangerous':
        return 'text-orange-400 border-orange-400/30 bg-orange-400/10'

      case 'suspicious':
        return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'

      case 'clean':
        return 'text-green-400 border-green-400/30 bg-green-400/10'

      default:
        return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10'
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">

      {/* HEADER */}
      <div className="mb-10">

        <div className="flex items-center gap-4 mb-4">

          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center glow-border-cyan">

            <History className="h-7 w-7 text-primary" />

          </div>

          <div>
            <h1 className="text-4xl font-bold">
              IOC History
            </h1>

            <p className="text-zinc-400 mt-1">
              Threat intelligence activity timeline
            </p>
          </div>

        </div>

      </div>

      {/* LOADING */}
      {loading ? (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {[1,2,3,4,5,6].map((item) => (

            <div
              key={item}
              className="h-52 rounded-2xl bg-zinc-900/50 border border-zinc-800 animate-pulse"
            />

          ))}

        </div>

      ) : history.length === 0 ? (

        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-32">

          <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 glow-border-cyan">

            <ShieldAlert className="h-10 w-10 text-primary" />

          </div>

          <h2 className="text-2xl font-bold mb-2">
            No IOC History
          </h2>

          <p className="text-zinc-400">
            Start analyzing indicators of compromise
          </p>

        </div>

      ) : (

        /* HISTORY GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {history.map((item, index) => (

            <motion.div
              key={item.id}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05,
              }}
            >

              <GlassCard className="h-full">

                {/* TOP */}
                <div className="flex items-start justify-between mb-6">

                  <div>

                    <p className="text-zinc-400 text-sm mb-2">
                      Indicator of Compromise
                    </p>

                    <h2 className="text-xl font-bold font-mono break-all">
                      {item.ioc}
                    </h2>

                  </div>

                  <div
                    className={`
                      px-3 py-1 rounded-full
                      text-xs font-semibold
                      border
                      ${getStatusColor(item.status)}
                    `}
                  >
                    {item.status}
                  </div>

                </div>

                {/* METRICS */}
                <div className="space-y-4">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 text-zinc-400">

                      <ShieldAlert className="h-4 w-4" />

                      <span>Risk Score</span>

                    </div>

                    <span className="font-bold text-lg">
                      {item.risk_score}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 text-zinc-400">

                      <Globe className="h-4 w-4" />

                      <span>Country</span>

                    </div>

                    <span>
                      {item.country}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 text-zinc-400">

                      <User className="h-4 w-4" />

                      <span>Analyst</span>

                    </div>

                    <span>
                      {item.username}
                    </span>

                  </div>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2 text-zinc-400">

                      <Clock3 className="h-4 w-4" />

                      <span>Timestamp</span>

                    </div>

                    <span className="text-sm">
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </span>

                  </div>

                </div>

              </GlassCard>

            </motion.div>

          ))}

        </div>

      )}

    </div>
  )
}