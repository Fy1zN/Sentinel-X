'use client'

import { motion } from 'framer-motion'
import { Clock, User, ChevronRight } from 'lucide-react'
import { SeverityBadge, StatusBadge } from '@/components/ui/severity-badge'
import { cn } from '@/lib/utils'
import type { Alert } from '@/lib/types'

interface AlertCardProps {
  alert: Alert
  onClick?: () => void
  compact?: boolean
}

export function AlertCard({ alert, onClick, compact = false }: AlertCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01, x: 4 }}
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-card transition-all duration-200 cursor-pointer',
        alert.severity === 'critical' && 'border-cyber-red/30 hover:border-cyber-red/50',
        alert.severity === 'high' && 'border-cyber-orange/30 hover:border-cyber-orange/50',
        alert.severity === 'medium' && 'border-cyber-yellow/30 hover:border-cyber-yellow/50',
        alert.severity === 'low' && 'border-border hover:border-primary/30',
        compact ? 'p-3' : 'p-4'
      )}
    >
      {/* Severity Indicator Line */}
      <div
        className={cn(
          'absolute left-0 top-0 h-full w-1',
          alert.severity === 'critical' && 'bg-cyber-red',
          alert.severity === 'high' && 'bg-cyber-orange',
          alert.severity === 'medium' && 'bg-cyber-yellow',
          alert.severity === 'low' && 'bg-cyber-green'
        )}
      />

      <div className="pl-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <SeverityBadge severity={alert.severity} size="sm" pulse={alert.status === 'new'} />
              <StatusBadge status={alert.status} size="sm" />
            </div>
            <h4 className={cn(
              'font-medium text-foreground truncate',
              compact ? 'text-sm' : 'text-base'
            )}>
              {alert.title}
            </h4>
            {!compact && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {alert.description}
              </p>
            )}
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>

        <div className={cn(
          'flex items-center gap-4 text-xs text-muted-foreground',
          compact ? 'mt-2' : 'mt-3'
        )}>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(alert.timestamp).toLocaleString()}
          </span>
          {alert.assignee && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {alert.assignee}
            </span>
          )}
          <span className="text-primary/70">{alert.source}</span>
        </div>
      </div>
    </motion.div>
  )
}

interface AlertFeedProps {
  alerts: Alert[]
  maxItems?: number
  compact?: boolean
}

export function AlertFeed({ alerts, maxItems = 5, compact = false }: AlertFeedProps) {
  const displayAlerts = alerts.slice(0, maxItems)

  return (
    <div className="space-y-3">
      {displayAlerts.map((alert, index) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <AlertCard alert={alert} compact={compact} />
        </motion.div>
      ))}
    </div>
  )
}
