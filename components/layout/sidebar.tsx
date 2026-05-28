'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

import {
  LayoutDashboard,
  Search,
  Shield,
  Bug,
  GitBranch,
  BarChart3,
  Bookmark,
  FileText,
  Settings,
  History,
  ChevronLeft,
 ChevronRight,
} from 'lucide-react'

import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },

  {
    label: 'IOC Search',
    href: '/ioc-search',
    icon: Search,
  },

  {
    label: 'History',
    href: '/history',
    icon: History,
  },

  {
    label: 'Threat Intelligence',
    href: '/threat-intel',
    icon: Shield,
  },

  {
    label: 'CVE Monitor',
    href: '/cve-monitor',
    icon: Bug,
  },

  {
    label: 'Threat Correlation',
    href: '/correlation',
    icon: GitBranch,
  },

  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },

  {
    label: 'Watchlists',
    href: '/watchlists',
    icon: Bookmark,
  },

  {
    label: 'Reports',
    href: '/reports',
    icon: FileText,
  },

  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? 72 : 256,
      }}
      className="
        fixed left-0 top-0 z-40
        h-screen
        flex flex-col
        border-r border-border
        bg-sidebar
      "
    >
      {/* LOGO */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{
                opacity: 0,
                x: -10,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: -10,
              }}
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 glow-border-cyan">
                <Shield className="h-5 w-5 text-primary" />
              </div>

              <span className="text-lg font-semibold tracking-tight">
                SentinelX
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 glow-border-cyan mx-auto">
            <Shield className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            const Icon = item.icon

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    `
                    flex items-center gap-3
                    rounded-lg
                    px-3 py-2.5
                    text-sm font-medium
                    transition-all duration-200
                    hover:bg-sidebar-accent
                    hover:text-sidebar-accent-foreground
                    `,
                    isActive &&
                      'bg-primary/10 text-primary glow-border-cyan',

                    collapsed &&
                      'justify-center px-2'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 shrink-0',
                      isActive && 'text-primary'
                    )}
                  />

                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{
                          opacity: 0,
                          width: 0,
                        }}
                        animate={{
                          opacity: 1,
                          width: 'auto',
                        }}
                        exit={{
                          opacity: 0,
                          width: 0,
                        }}
                        className="truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* COLLAPSE BUTTON */}
      <div className="border-t border-border p-2">
        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
          className="
            flex w-full items-center justify-center gap-2
            rounded-lg px-3 py-2.5
            text-sm font-medium
            text-muted-foreground
            transition-colors
            hover:bg-sidebar-accent
            hover:text-sidebar-accent-foreground
          "
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  )
}