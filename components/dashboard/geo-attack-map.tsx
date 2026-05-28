'use client'

import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GeoAttackData } from '@/lib/types'

interface GeoAttackMapProps {
  data: GeoAttackData[]
}

export function GeoAttackMap({ data }: GeoAttackMapProps) {
  const maxAttacks = Math.max(...data.map(d => d.attackCount))
  
  return (
    <div className="space-y-4">
      {/* Simple visual representation */}
      <div className="relative h-48 rounded-lg bg-secondary/30 border border-border overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        {/* Decorative globe */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Globe className="h-24 w-24 text-primary/20" />
        </div>
        
        {/* Attack indicators */}
        <div className="absolute inset-0 p-4">
          {data.slice(0, 6).map((item, index) => {
            const size = (item.attackCount / maxAttacks) * 30 + 10
            const positions = [
              { top: '20%', left: '70%' },
              { top: '30%', left: '80%' },
              { top: '40%', left: '20%' },
              { top: '50%', left: '60%' },
              { top: '60%', left: '30%' },
              { top: '70%', left: '75%' },
            ]
            
            return (
              <motion.div
                key={item.countryCode}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  position: 'absolute',
                  ...positions[index],
                  width: size,
                  height: size,
                }}
                className="rounded-full bg-cyber-red/30 border border-cyber-red/50 animate-pulse-glow"
              />
            )
          })}
        </div>
      </div>

      {/* Country list */}
      <div className="space-y-2">
        {data.slice(0, 5).map((item, index) => (
          <motion.div
            key={item.countryCode}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 text-xs font-mono text-muted-foreground">
              {item.countryCode}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{item.country}</span>
                <span className="text-xs text-muted-foreground">
                  {item.attackCount.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    'h-full rounded-full',
                    index === 0 && 'bg-cyber-red',
                    index === 1 && 'bg-cyber-orange',
                    index === 2 && 'bg-cyber-yellow',
                    index >= 3 && 'bg-primary'
                  )}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
