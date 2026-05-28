'use client'

import { motion } from 'framer-motion'
import {
  Settings,
  User,
  Bell,
  Shield,
  Key,
  Database,
  Globe,
  Palette,
  Zap,
  ChevronRight,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SettingsSectionProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  onClick?: () => void
}

function SettingsSection({ icon: Icon, title, description, onClick }: SettingsSectionProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/30 cursor-pointer transition-all"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground" />
    </motion.div>
  )
}

export default function SettingsPage() {
  const settingsSections = [
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your account details and preferences',
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Configure alert preferences and channels',
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Two-factor authentication and session management',
    },
    {
      icon: Key,
      title: 'API Keys',
      description: 'Manage API access tokens and integrations',
    },
    {
      icon: Database,
      title: 'Data Sources',
      description: 'Configure threat intelligence feed connections',
    },
    {
      icon: Globe,
      title: 'Integrations',
      description: 'Connect SIEM, SOAR, and other security tools',
    },
    {
      icon: Palette,
      title: 'Appearance',
      description: 'Customize dashboard theme and layout',
    },
    {
      icon: Zap,
      title: 'Automation',
      description: 'Set up automated response actions and workflows',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and platform configuration
          </p>
        </div>

        {/* User Profile Card */}
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 border-2 border-primary/30">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold">John Smith</h2>
              <p className="text-sm text-muted-foreground">SOC Analyst - Level 2</p>
              <p className="text-xs text-muted-foreground mt-1">john.smith@company.com</p>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
        </GlassCard>

        {/* Settings Sections */}
        <div className="space-y-3">
          {settingsSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <SettingsSection {...section} />
            </motion.div>
          ))}
        </div>

        {/* System Info */}
        <GlassCard title="System Information" subtitle="Platform details">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex justify-between p-3 rounded-lg bg-secondary/30">
              <span className="text-sm text-muted-foreground">Platform Version</span>
              <span className="text-sm font-mono">v2.4.1</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-secondary/30">
              <span className="text-sm text-muted-foreground">License Type</span>
              <span className="text-sm">Enterprise</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-secondary/30">
              <span className="text-sm text-muted-foreground">Data Retention</span>
              <span className="text-sm">365 days</span>
            </div>
            <div className="flex justify-between p-3 rounded-lg bg-secondary/30">
              <span className="text-sm text-muted-foreground">Last Backup</span>
              <span className="text-sm">2 hours ago</span>
            </div>
          </div>
        </GlassCard>

        {/* Danger Zone */}
        <GlassCard title="Danger Zone" subtitle="Irreversible actions">
          <div className="flex items-center justify-between p-4 rounded-lg border border-cyber-red/30 bg-cyber-red/5">
            <div>
              <h4 className="font-medium text-cyber-red">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="outline" className="border-cyber-red/50 text-cyber-red hover:bg-cyber-red/10">
              Delete Account
            </Button>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  )
}
