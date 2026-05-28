'use client'

import { motion } from 'framer-motion'
import { Clock, User, Shield, FileText, AlertTriangle, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ActivityLogEntry } from '@/lib/types'

interface ActivityFeedProps {
  entries: ActivityLogEntry[]
  maxItems?: number
}

const categoryIcons = {
  alert: AlertTriangle,
  investigation: Shield,
  configuration: Settings,
  report: FileText,
}

const categoryColors = {
  alert: 'text-cyber-orange bg-cyber-orange/10',
  investigation: 'text-cyber-cyan bg-cyber-cyan/10',
  configuration: 'text-cyber-yellow bg-cyber-yellow/10',
  report: 'text-cyber-green bg-cyber-green/10',
}

export function ActivityFeed({ entries, maxItems = 8 }: ActivityFeedProps) {
  const displayEntries = entries.slice(0, maxItems)

  return (
    <div className="space-y-1">
      {displayEntries.map((entry, index) => {
        const Icon = categoryIcons[entry.category]
        
        return (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03 }}
            className="group relative flex items-start gap-3 rounded-lg p-3 hover:bg-secondary/50 transition-colors"
          >
            {/* Timeline connector */}
            {index < displayEntries.length - 1 && (
              <div className="absolute left-[26px] top-12 h-[calc(100%-24px)] w-px bg-border" />
            )}
            
            {/* Icon */}
            <div className={cn('rounded-lg p-2 shrink-0', categoryColors[entry.category])}>
              <Icon className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium">{entry.action}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{entry.details}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {entry.user}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
