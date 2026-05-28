'use client'

import { motion } from 'framer-motion'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: LucideIcon
  iconColor?: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
  glowColor?: 'cyan' | 'red' | 'green' | 'yellow'
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-primary',
  trend,
  className,
  glowColor,
}: StatCardProps) {
  const glowClasses = {
    cyan: 'glow-border-cyan',
    red: 'border-cyber-red/30 shadow-[0_0_10px_rgba(255,70,70,0.1)]',
    green: 'border-cyber-green/30 shadow-[0_0_10px_rgba(70,255,150,0.1)]',
    yellow: 'border-cyber-yellow/30 shadow-[0_0_10px_rgba(255,200,70,0.1)]',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card p-5',
        glowColor && glowClasses[glowColor],
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
          {Icon && (
            <div className={cn('rounded-lg bg-secondary p-2.5', iconColor)}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>

        {(change !== undefined || changeLabel) && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            {change !== undefined && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 font-medium',
                  change > 0 ? 'text-cyber-red' : change < 0 ? 'text-cyber-green' : 'text-muted-foreground'
                )}
              >
                {trend === 'up' || change > 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : trend === 'down' || change < 0 ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <Minus className="h-4 w-4" />
                )}
                {Math.abs(change)}%
              </span>
            )}
            {changeLabel && (
              <span className="text-muted-foreground">{changeLabel}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface MiniStatCardProps {
  label: string
  value: string | number
  color?: 'cyan' | 'red' | 'green' | 'yellow' | 'orange'
}

const colorClasses = {
  cyan: 'text-cyber-cyan',
  red: 'text-cyber-red',
  green: 'text-cyber-green',
  yellow: 'text-cyber-yellow',
  orange: 'text-cyber-orange',
}

export function MiniStatCard({ label, value, color = 'cyan' }: MiniStatCardProps) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 rounded-lg bg-secondary/50 border border-border">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn('text-lg font-bold', colorClasses[color])}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  )
}
