'use client'

import { motion } from 'framer-motion'
import { Activity, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { StatusBadge } from '@/components/ui/severity-badge'
import { cn } from '@/lib/utils'
import type { ThreatFeed } from '@/lib/types'

interface ThreatFeedCardProps {
  feed: ThreatFeed
  onClick?: () => void
}

export function ThreatFeedCard({ feed, onClick }: ThreatFeedCardProps) {
  const timeSinceUpdate = () => {
    const diff = Date.now() - new Date(feed.lastUpdate).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-lg border bg-card p-4 cursor-pointer transition-all',
        feed.status === 'error' && 'border-cyber-red/30',
        feed.status === 'active' && 'border-border hover:border-primary/30',
        feed.status === 'inactive' && 'border-border opacity-60'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            feed.status === 'active' && 'bg-cyber-green/10',
            feed.status === 'error' && 'bg-cyber-red/10',
            feed.status === 'inactive' && 'bg-muted'
          )}>
            {feed.status === 'active' && <Activity className="h-5 w-5 text-cyber-green" />}
            {feed.status === 'error' && <AlertCircle className="h-5 w-5 text-cyber-red" />}
            {feed.status === 'inactive' && <Activity className="h-5 w-5 text-muted-foreground" />}
          </div>
          <div>
            <h4 className="font-medium">{feed.name}</h4>
            <p className="text-xs text-muted-foreground">
              {feed.indicatorCount.toLocaleString()} indicators
            </p>
          </div>
        </div>
        <StatusBadge status={feed.status} size="sm" />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <RefreshCw className="h-3 w-3" />
          {timeSinceUpdate()}
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-cyber-green" />
          {feed.reliability}% reliable
        </span>
      </div>

      {/* Reliability bar */}
      <div className="mt-2 h-1 w-full rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${feed.reliability}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="h-full bg-primary/60 rounded-full"
        />
      </div>
    </motion.div>
  )
}

interface FeedGridProps {
  feeds: ThreatFeed[]
}

export function FeedGrid({ feeds }: FeedGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {feeds.map((feed, index) => (
        <motion.div
          key={feed.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ThreatFeedCard feed={feed} />
        </motion.div>
      ))}
    </div>
  )
}
