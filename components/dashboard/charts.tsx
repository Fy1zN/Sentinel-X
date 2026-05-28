'use client'

import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { ChartDataPoint } from '@/lib/types'

// Custom Tooltip Component
interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null

  return (
    <div className="rounded-lg border border-border bg-card/95 backdrop-blur-sm p-3 shadow-xl">
      <p className="text-xs font-medium text-muted-foreground mb-2">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground capitalize">{entry.name}:</span>
          <span className="font-medium">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

// Color palette matching our cyber theme
const COLORS = {
  critical: 'oklch(0.55 0.22 25)',
  high: 'oklch(0.7 0.2 50)',
  medium: 'oklch(0.8 0.18 90)',
  low: 'oklch(0.65 0.2 145)',
  primary: 'oklch(0.75 0.18 195)',
  secondary: 'oklch(0.65 0.18 280)',
}

const PIE_COLORS = [
  COLORS.primary,
  COLORS.low,
  COLORS.medium,
  COLORS.high,
  COLORS.secondary,
]

interface ThreatTrendChartProps {
  data: ChartDataPoint[]
}

export function ThreatTrendChart({ data }: ThreatTrendChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="criticalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.critical} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.critical} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.high} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.high} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.medium} stopOpacity={0.2} />
              <stop offset="95%" stopColor={COLORS.medium} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="oklch(0.5 0.01 250)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="oklch(0.5 0.01 250)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="critical"
            stroke={COLORS.critical}
            strokeWidth={2}
            fill="url(#criticalGradient)"
          />
          <Area
            type="monotone"
            dataKey="high"
            stroke={COLORS.high}
            strokeWidth={2}
            fill="url(#highGradient)"
          />
          <Area
            type="monotone"
            dataKey="medium"
            stroke={COLORS.medium}
            strokeWidth={2}
            fill="url(#mediumGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

interface AttackCategoryChartProps {
  data: ChartDataPoint[]
}

export function AttackCategoryChart({ data }: AttackCategoryChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[250px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PIE_COLORS[index % PIE_COLORS.length]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs text-muted-foreground">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

interface SourceContributionChartProps {
  data: ChartDataPoint[]
}

export function SourceContributionChart({ data }: SourceContributionChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[250px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250)" horizontal={false} />
          <XAxis
            type="number"
            stroke="oklch(0.5 0.01 250)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="oklch(0.5 0.01 250)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

interface ActivityHeatmapProps {
  data: ChartDataPoint[]
}

export function ActivityLineChart({ data }: ActivityHeatmapProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[200px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="oklch(0.5 0.01 250)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval={2}
          />
          <YAxis
            stroke="oklch(0.5 0.01 250)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="threats"
            stroke={COLORS.primary}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="alerts"
            stroke={COLORS.high}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
