
'use client'

import { useEffect, useMemo, useState } from 'react'

import { motion } from 'framer-motion'

import {
  Bookmark,
  Plus,
  Search,
  Trash2,
  Bell,
  BellOff,
  Clock,
  AlertTriangle,
  Shield,
} from 'lucide-react'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface WatchlistItem {

  id: number

  ioc: string

  ioc_type: string

  severity: string

  notes: string

  is_active: boolean

  created_at: string

  last_triggered?: string
}

const API_BASE = 'http://127.0.0.1:8000'

export default function WatchlistPage() {

  const [watchlist, setWatchlist] =
    useState<WatchlistItem[]>([])

  const [loading, setLoading] =
    useState(true)

  const [searchQuery, setSearchQuery] =
    useState('')

  const [ioc, setIoc] =
    useState('')

  const [iocType, setIocType] =
    useState('ip')

  const [severity, setSeverity] =
    useState('medium')

  const [notes, setNotes] =
    useState('')

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null

  // =====================================================
  // FETCH WATCHLIST
  // =====================================================
  const fetchWatchlist = async () => {

    try {

      const response = await fetch(

        `${API_BASE}/watchlist/`,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      )

      const data = await response.json()

      setWatchlist(data || [])

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {

    fetchWatchlist()

  }, [])

  // =====================================================
  // ADD IOC
  // =====================================================
  const addWatchlistItem = async () => {

    if (!ioc.trim()) return

    try {

      const response = await fetch(

        `${API_BASE}/watchlist/add`,

        {

          method: 'POST',

          headers: {

            'Content-Type': 'application/json',

            Authorization: `Bearer ${token}`

          },

          body: JSON.stringify({

            ioc,

            ioc_type: iocType,

            severity,

            notes

          })

        }

      )

      const result = await response.json()

      if (result.success) {

        setIoc('')
        setNotes('')

        fetchWatchlist()
      }

    } catch (err) {

      console.error(err)

    }
  }

  // =====================================================
  // DELETE IOC
  // =====================================================
  const deleteIOC = async (
    id: number
  ) => {

    try {

      await fetch(

        `${API_BASE}/watchlist/${id}`,

        {

          method: 'DELETE',

          headers: {
            Authorization: `Bearer ${token}`
          }

        }

      )

      fetchWatchlist()

    } catch (err) {

      console.error(err)

    }
  }

  // =====================================================
  // TOGGLE ACTIVE
  // =====================================================
  const toggleIOC = async (
    id: number
  ) => {

    try {

      await fetch(

        `${API_BASE}/watchlist/${id}`,

        {

          method: 'PUT',

          headers: {
            Authorization: `Bearer ${token}`
          }

        }

      )

      fetchWatchlist()

    } catch (err) {

      console.error(err)

    }
  }

  // =====================================================
  // FILTERED
  // =====================================================
  const filteredItems = useMemo(() => {

    return watchlist.filter((item) =>

      item.ioc
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

      ||

      item.notes?.toLowerCase()
        .includes(searchQuery.toLowerCase())

    )

  }, [watchlist, searchQuery])

  // =====================================================
  // STATS
  // =====================================================
  const stats = {

    total:
      watchlist.length,

    active:
      watchlist.filter(
        (i) => i.is_active
      ).length,

    critical:
      watchlist.filter(
        (i) => i.severity === 'critical'
      ).length,

    high:
      watchlist.filter(
        (i) => i.severity === 'high'
      ).length

  }

  return (

    <DashboardLayout>

      <div className="space-y-6">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold">
              Watchlists
            </h1>

            <p className="text-muted-foreground mt-1">
              Monitor high-risk indicators and threat infrastructure
            </p>

          </div>

        </div>

        {/* ===================================================== */}
        {/* STATS */}
        {/* ===================================================== */}

        <div className="grid gap-4 md:grid-cols-4">

          <div className="rounded-xl border border-border bg-card p-5">

            <div className="flex items-center gap-3">

              <Bookmark className="h-5 w-5 text-cyan-400" />

              <span className="text-sm text-muted-foreground">
                Total IOCs
              </span>

            </div>

            <h2 className="mt-3 text-3xl font-bold">
              {stats.total}
            </h2>

          </div>

          <div className="rounded-xl border border-green-500/30 bg-card p-5">

            <div className="flex items-center gap-3">

              <Shield className="h-5 w-5 text-green-400" />

              <span className="text-sm text-muted-foreground">
                Active Monitoring
              </span>

            </div>

            <h2 className="mt-3 text-3xl font-bold">
              {stats.active}
            </h2>

          </div>

          <div className="rounded-xl border border-red-500/30 bg-card p-5">

            <div className="flex items-center gap-3">

              <AlertTriangle className="h-5 w-5 text-red-400" />

              <span className="text-sm text-muted-foreground">
                Critical
              </span>

            </div>

            <h2 className="mt-3 text-3xl font-bold">
              {stats.critical}
            </h2>

          </div>

          <div className="rounded-xl border border-orange-500/30 bg-card p-5">

            <div className="flex items-center gap-3">

              <AlertTriangle className="h-5 w-5 text-orange-400" />

              <span className="text-sm text-muted-foreground">
                High Severity
              </span>

            </div>

            <h2 className="mt-3 text-3xl font-bold">
              {stats.high}
            </h2>

          </div>

        </div>

        {/* ===================================================== */}
        {/* ADD IOC */}
        {/* ===================================================== */}

        <div className="rounded-xl border border-border bg-card p-5">

          <h2 className="text-lg font-semibold mb-4">
            Add IOC to Watchlist
          </h2>

          <div className="grid gap-4 md:grid-cols-5">

            <Input
              placeholder="IOC"
              value={ioc}
              onChange={(e) =>
                setIoc(e.target.value)
              }
            />

            <select
              value={iocType}
              onChange={(e) =>
                setIocType(e.target.value)
              }
              className="rounded-md border border-border bg-background px-3 py-2"
            >
              <option value="ip">IP</option>
              <option value="domain">Domain</option>
              <option value="url">URL</option>
              <option value="hash">Hash</option>
            </select>

            <select
              value={severity}
              onChange={(e) =>
                setSeverity(e.target.value)
              }
              className="rounded-md border border-border bg-background px-3 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <Input
              placeholder="Notes"
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
            />

            <Button
              onClick={addWatchlistItem}
              className="bg-cyan-500 hover:bg-cyan-600"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add IOC
            </Button>

          </div>

        </div>

        {/* ===================================================== */}
        {/* SEARCH */}
        {/* ===================================================== */}

        <div className="relative max-w-md">

          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search watchlist..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="pl-10"
          />

        </div>

        {/* ===================================================== */}
        {/* TABLE */}
        {/* ===================================================== */}

        <div className="space-y-4">

          {loading ? (

            <div className="text-muted-foreground">
              Loading watchlist...
            </div>

          ) : filteredItems.length === 0 ? (

            <div className="rounded-xl border border-border bg-card p-10 text-center">

              <Bookmark className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />

              <h3 className="text-lg font-semibold">
                No Watchlist Items
              </h3>

              <p className="text-muted-foreground mt-2">
                Add indicators to begin monitoring.
              </p>

            </div>

          ) : (

            filteredItems.map((item, index) => (

              <motion.div

                key={item.id}

                initial={{
                  opacity: 0,
                  y: 10
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}

                transition={{
                  delay: index * 0.04
                }}

                className="rounded-xl border border-border bg-card p-5"

              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex-1">

                    <div className="flex items-center gap-2 mb-3">

                      <span className="rounded bg-cyan-500/10 px-2 py-1 text-xs text-cyan-400 uppercase">
                        {item.ioc_type}
                      </span>

                      <span className={`
                        rounded px-2 py-1 text-xs uppercase

                        ${item.severity === 'critical'
                          ? 'bg-red-500/10 text-red-400'
                          : ''}

                        ${item.severity === 'high'
                          ? 'bg-orange-500/10 text-orange-400'
                          : ''}

                        ${item.severity === 'medium'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : ''}

                        ${item.severity === 'low'
                          ? 'bg-green-500/10 text-green-400'
                          : ''}
                      `}>
                        {item.severity}
                      </span>

                      {item.is_active ? (

                        <span className="flex items-center gap-1 rounded bg-green-500/10 px-2 py-1 text-xs text-green-400">

                          <Bell className="h-3 w-3" />

                          ACTIVE

                        </span>

                      ) : (

                        <span className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs text-muted-foreground">

                          <BellOff className="h-3 w-3" />

                          DISABLED

                        </span>

                      )}

                    </div>

                    <code className="block break-all text-sm font-mono">

                      {item.ioc}

                    </code>

                    {item.notes && (

                      <p className="mt-3 text-sm text-muted-foreground">

                        {item.notes}

                      </p>

                    )}

                    <div className="mt-4 flex items-center gap-5 text-xs text-muted-foreground">

                      <span className="flex items-center gap-1">

                        <Clock className="h-3 w-3" />

                        {new Date(
                          item.created_at
                        ).toLocaleString()}

                      </span>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex items-center gap-2">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toggleIOC(item.id)
                      }
                    >

                      {item.is_active
                        ? 'Disable'
                        : 'Enable'}

                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        deleteIOC(item.id)
                      }
                    >

                      <Trash2 className="h-4 w-4" />

                    </Button>

                  </div>

                </div>

              </motion.div>

            ))

          )}

        </div>

      </div>

    </DashboardLayout>

  )
}

