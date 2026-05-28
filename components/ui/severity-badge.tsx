'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { SeverityLevel } from '@/lib/types'

interface SeverityBadgeProps {
  severity: SeverityLevel
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  pulse?: boolean
}

const severityConfig = {
  critical: {
    label: 'Critical',
    className: 'bg-cyber-red/20 text-cyber-red border-cyber-red/30',
    dotClassName: 'bg-cyber-red',
  },
  high: {
    label: 'High',
    className: 'bg-cyber-orange/20 text-cyber-orange border-cyber-orange/30',
    dotClassName: 'bg-cyber-orange',
  },
  medium: {
    label: 'Medium',
    className: 'bg-cyber-yellow/20 text-cyber-yellow border-cyber-yellow/30',
    dotClassName: 'bg-cyber-yellow',
  },
  low: {
    label: 'Low',
    className: 'bg-cyber-green/20 text-cyber-green border-cyber-green/30',
    dotClassName: 'bg-cyber-green',
  },
}

const sizeConfig = {
  sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-1 text-xs',
  lg: 'px-2.5 py-1.5 text-sm',
}

export function SeverityBadge({ 
  severity, 
  size = 'md', 
  showLabel = true,
  pulse = false 
}: SeverityBadgeProps) {
  const config = severityConfig[severity]
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border font-medium',
        config.className,
        sizeConfig[size]
      )}
    >
      <motion.span
        className={cn('h-1.5 w-1.5 rounded-full', config.dotClassName)}
        animate={pulse ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] } : undefined}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {showLabel && config.label}
    </span>
  )
}

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'error' | 'operational' | 'degraded' | 'down' | 'new' | 'investigating' | 'resolved' | 'dismissed'
  size?: 'sm' | 'md' | 'lg'
}

const statusConfig = {
  active: { label: 'Active', className: 'bg-cyber-green/20 text-cyber-green border-cyber-green/30' },
  operational: { label: 'Operational', className: 'bg-cyber-green/20 text-cyber-green border-cyber-green/30' },
  resolved: { label: 'Resolved', className: 'bg-cyber-green/20 text-cyber-green border-cyber-green/30' },
  inactive: { label: 'Inactive', className: 'bg-muted text-muted-foreground border-border' },
  dismissed: { label: 'Dismissed', className: 'bg-muted text-muted-foreground border-border' },
  degraded: { label: 'Degraded', className: 'bg-cyber-yellow/20 text-cyber-yellow border-cyber-yellow/30' },
  investigating: { label: 'Investigating', className: 'bg-cyber-yellow/20 text-cyber-yellow border-cyber-yellow/30' },
  new: { label: 'New', className: 'bg-cyber-cyan/20 text-cyber-cyan border-cyber-cyan/30' },
  error: { label: 'Error', className: 'bg-cyber-red/20 text-cyber-red border-cyber-red/30' },
  down: { label: 'Down', className: 'bg-cyber-red/20 text-cyber-red border-cyber-red/30' },
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border font-medium',
        config.className,
        sizeConfig[size]
      )}
    >
      {config.label}
    </span>
  )
}

interface IndicatorTypeBadgeProps {
  type: 'ip' | 'domain' | 'url' | 'hash'
  size?: 'sm' | 'md' | 'lg'
}

const typeConfig = {
  ip: { label: 'IP', className: 'bg-primary/20 text-primary border-primary/30' },
  domain: { label: 'Domain', className: 'bg-chart-5/20 text-chart-5 border-chart-5/30' },
  url: { label: 'URL', className: 'bg-chart-2/20 text-chart-2 border-chart-2/30' },
  hash: { label: 'Hash', className: 'bg-chart-3/20 text-chart-3 border-chart-3/30' },
}

export function IndicatorTypeBadge({ type, size = 'md' }: IndicatorTypeBadgeProps) {
  const config = typeConfig[type]
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border font-mono font-medium uppercase',
        config.className,
        sizeConfig[size]
      )}
    >
      {config.label}
    </span>
  )
}
