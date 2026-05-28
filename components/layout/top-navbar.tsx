'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Bell,
  User,
  ChevronDown,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockSystemHealth, mockAlerts } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function TopNavbar() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const criticalAlerts = mockAlerts.filter(a => a.severity === 'critical' && a.status === 'new').length
  const systemStatus = mockSystemHealth.every(s => s.status === 'operational') 
    ? 'operational' 
    : mockSystemHealth.some(s => s.status === 'down') 
      ? 'down' 
      : 'degraded'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
      {/* Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search IOCs, alerts, CVEs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-border focus:border-primary focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* System Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border">
          <div className={cn(
            'h-2 w-2 rounded-full animate-pulse-glow',
            systemStatus === 'operational' && 'bg-cyber-green text-cyber-green',
            systemStatus === 'degraded' && 'bg-cyber-yellow text-cyber-yellow',
            systemStatus === 'down' && 'bg-cyber-red text-cyber-red'
          )} />
          <span className="text-xs font-medium text-muted-foreground capitalize">
            {systemStatus}
          </span>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {criticalAlerts > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyber-red text-[10px] font-bold text-foreground"
                >
                  {criticalAlerts}
                </motion.span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-card border-border">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <span className="text-xs font-normal text-muted-foreground">
                {criticalAlerts} critical
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockAlerts.slice(0, 4).map((alert) => (
              <DropdownMenuItem key={alert.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'h-2 w-2 rounded-full',
                    alert.severity === 'critical' && 'bg-cyber-red',
                    alert.severity === 'high' && 'bg-cyber-orange',
                    alert.severity === 'medium' && 'bg-cyber-yellow',
                    alert.severity === 'low' && 'bg-cyber-green'
                  )} />
                  <span className="text-sm font-medium truncate max-w-[240px]">
                    {alert.title}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary cursor-pointer">
              View all alerts
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* System Health */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Activity className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 bg-card border-border">
            <DropdownMenuLabel>System Health</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockSystemHealth.map((service) => (
              <DropdownMenuItem key={service.service} className="flex items-center justify-between p-3">
                <span className="text-sm">{service.service}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{service.latency}ms</span>
                  {service.status === 'operational' && <CheckCircle2 className="h-4 w-4 text-cyber-green" />}
                  {service.status === 'degraded' && <AlertTriangle className="h-4 w-4 text-cyber-yellow" />}
                  {service.status === 'down' && <XCircle className="h-4 w-4 text-cyber-red" />}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 border border-primary/30">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">John Smith</span>
                <span className="text-xs text-muted-foreground">SOC Analyst</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border-border">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Preferences</DropdownMenuItem>
            <DropdownMenuItem>API Keys</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-cyber-red">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
