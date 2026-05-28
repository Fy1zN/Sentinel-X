// Core threat intelligence types

export interface ThreatIndicator {
  id: string
  type: 'ip' | 'domain' | 'url' | 'hash'
  value: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  confidence: number
  firstSeen: string
  lastSeen: string
  sources: string[]
  tags: string[]
  country?: string
  asn?: string
  maliciousScore: number
}

export interface Alert {
  id: string
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  status: 'new' | 'investigating' | 'resolved' | 'dismissed'
  timestamp: string
  source: string
  indicators: string[]
  assignee?: string
}

export interface ThreatFeed {
  id: string
  name: string
  status: 'active' | 'inactive' | 'error'
  lastUpdate: string
  indicatorCount: number
  reliability: number
}

export interface CVEEntry {
  id: string
  cveId: string
  title: string
  description: string
  cvssScore: number
  severity: 'critical' | 'high' | 'medium' | 'low'
  publishedDate: string
  modifiedDate: string
  affectedProducts: string[]
  exploitAvailable: boolean
  patchAvailable: boolean
  references: string[]
}

export interface WatchlistItem {
  id: string
  indicator: ThreatIndicator
  addedDate: string
  addedBy: string
  notes?: string
  alertOnChange: boolean
  lastChecked: string
}

export interface Report {
  id: string
  title: string
  type: 'ioc_summary' | 'threat_analysis' | 'cve_summary' | 'incident_report'
  generatedDate: string
  period: string
  status: 'ready' | 'generating' | 'error'
  downloadUrl?: string
}

export interface ThreatCorrelation {
  id: string
  indicators: ThreatIndicator[]
  attackCluster: string
  confidence: number
  firstSeen: string
  lastSeen: string
  sources: string[]
  ttps: string[]
}

export interface ActivityLogEntry {
  id: string
  timestamp: string
  user: string
  action: string
  details: string
  category: 'alert' | 'investigation' | 'configuration' | 'report'
}

export interface SystemHealth {
  service: string
  status: 'operational' | 'degraded' | 'down'
  latency: number
  lastCheck: string
  uptime: number
}

export interface GeoAttackData {
  country: string
  countryCode: string
  attackCount: number
  percentage: number
}

export interface ChartDataPoint {
  name: string
  value: number
  [key: string]: string | number
}

export interface IOCSearchResult {
  indicator: ThreatIndicator
  reputationScore: number
  maliciousDetections: number
  totalEngines: number
  abuseConfidence: number
  openPorts?: number[]
  whoisData?: {
    registrar?: string
    createdDate?: string
    expiresDate?: string
    organization?: string
  }
  relatedIndicators?: ThreatIndicator[]
}

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low'
export type AlertStatus = 'new' | 'investigating' | 'resolved' | 'dismissed'
