'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
  action?: ReactNode
  noPadding?: boolean
}

export function GlassCard({ 
  children, 
  className, 
  title, 
  subtitle, 
  action,
  noPadding = false 
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card/50 backdrop-blur-sm',
        className
      )}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent pointer-events-none" />
      
      {(title || action) && (
        <div className="relative flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            {title && <h3 className="text-base font-semibold">{title}</h3>}
            {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      
      <div className={cn('relative', !noPadding && 'p-5')}>
        {children}
      </div>
    </motion.div>
  )
}
