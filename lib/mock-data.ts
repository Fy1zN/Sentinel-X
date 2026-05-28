import type {
  ThreatIndicator,
  Alert,
  ThreatFeed,
  CVEEntry,
  WatchlistItem,
  Report,
  ThreatCorrelation,
  ActivityLogEntry,
  SystemHealth,
  GeoAttackData,
  ChartDataPoint,
} from './types'

// Helper to generate random dates
const randomDate = (daysAgo: number) => {
  return "2024-01-20T12:00:00Z"
}

// Threat Indicators
export const mockIndicators: ThreatIndicator[] = [
  {
    id: 'ioc-001',
    type: 'ip',
    value: '185.220.101.45',
    severity: 'critical',
    confidence: 95,
    firstSeen: '2024-01-15T08:30:00Z',
    lastSeen: '2024-01-20T14:22:00Z',
    sources: ['VirusTotal', 'AbuseIPDB', 'AlienVault OTX'],
    tags: ['tor-exit-node', 'botnet', 'c2-server'],
    country: 'Russia',
    asn: 'AS9009',
    maliciousScore: 92,
  },
  {
    id: 'ioc-002',
    type: 'domain',
    value: 'malicious-payload.xyz',
    severity: 'high',
    confidence: 88,
    firstSeen: '2024-01-10T12:00:00Z',
    lastSeen: '2024-01-19T09:45:00Z',
    sources: ['URLhaus', 'PhishTank', 'Spamhaus'],
    tags: ['phishing', 'credential-stealer'],
    country: 'China',
    asn: 'AS4134',
    maliciousScore: 85,
  },
  {
    id: 'ioc-003',
    type: 'hash',
    value: 'a1b2c3d4e5f6789012345678901234567890abcd',
    severity: 'critical',
    confidence: 99,
    firstSeen: '2024-01-18T16:00:00Z',
    lastSeen: '2024-01-20T11:30:00Z',
    sources: ['MalwareBazaar', 'VirusTotal', 'Hybrid Analysis'],
    tags: ['ransomware', 'lockbit', 'encryption'],
    maliciousScore: 98,
  },
  {
    id: 'ioc-004',
    type: 'url',
    value: 'https://fake-login.evil.com/signin',
    severity: 'high',
    confidence: 91,
    firstSeen: '2024-01-12T07:15:00Z',
    lastSeen: '2024-01-20T08:00:00Z',
    sources: ['PhishTank', 'Google Safe Browsing'],
    tags: ['phishing', 'credential-theft', 'microsoft-impersonation'],
    country: 'Netherlands',
    asn: 'AS60781',
    maliciousScore: 89,
  },
  {
    id: 'ioc-005',
    type: 'ip',
    value: '45.33.32.156',
    severity: 'medium',
    confidence: 72,
    firstSeen: '2024-01-08T14:30:00Z',
    lastSeen: '2024-01-17T19:22:00Z',
    sources: ['Shodan', 'GreyNoise'],
    tags: ['scanner', 'recon'],
    country: 'United States',
    asn: 'AS63949',
    maliciousScore: 45,
  },
  {
    id: 'ioc-006',
    type: 'domain',
    value: 'c2-server-alpha.net',
    severity: 'critical',
    confidence: 97,
    firstSeen: '2024-01-05T03:00:00Z',
    lastSeen: '2024-01-20T15:45:00Z',
    sources: ['Threatfox', 'MISP', 'CrowdStrike'],
    tags: ['c2', 'apt', 'cobalt-strike'],
    country: 'Iran',
    asn: 'AS49666',
    maliciousScore: 96,
  },
  {
    id: 'ioc-007',
    type: 'hash',
    value: 'b2c3d4e5f67890123456789012345678901234ef',
    severity: 'high',
    confidence: 85,
    firstSeen: '2024-01-14T10:20:00Z',
    lastSeen: '2024-01-19T16:10:00Z',
    sources: ['VirusTotal', 'Any.Run'],
    tags: ['trojan', 'emotet', 'banking'],
    maliciousScore: 82,
  },
  {
    id: 'ioc-008',
    type: 'ip',
    value: '91.134.203.82',
    severity: 'low',
    confidence: 55,
    firstSeen: '2024-01-16T22:00:00Z',
    lastSeen: '2024-01-20T06:30:00Z',
    sources: ['GreyNoise'],
    tags: ['mass-scanner'],
    country: 'France',
    asn: 'AS16276',
    maliciousScore: 25,
  },
]

// Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    title: 'Critical: Ransomware Activity Detected',
    description: 'LockBit 3.0 ransomware indicators detected on endpoint WORKSTATION-042. Immediate isolation recommended.',
    severity: 'critical',
    status: 'new',
    timestamp: '2024-01-20T14:35:22Z',
    source: 'EDR Integration',
    indicators: ['ioc-003'],
    assignee: 'John Smith',
  },
  {
    id: 'alert-002',
    title: 'High: Phishing Campaign Targeting Finance',
    description: 'Multiple phishing emails detected targeting finance department. Credential harvesting attempt in progress.',
    severity: 'high',
    status: 'investigating',
    timestamp: '2024-01-20T13:22:15Z',
    source: 'Email Gateway',
    indicators: ['ioc-002', 'ioc-004'],
    assignee: 'Sarah Chen',
  },
  {
    id: 'alert-003',
    title: 'C2 Communication Detected',
    description: 'Outbound connection to known Cobalt Strike C2 server detected from internal host.',
    severity: 'critical',
    status: 'investigating',
    timestamp: '2024-01-20T12:45:00Z',
    source: 'Network IDS',
    indicators: ['ioc-006'],
    assignee: 'Mike Johnson',
  },
  {
    id: 'alert-004',
    title: 'Suspicious Tor Exit Node Traffic',
    description: 'Unusual traffic patterns observed to known Tor exit node. Data exfiltration possible.',
    severity: 'high',
    status: 'new',
    timestamp: '2024-01-20T11:30:45Z',
    source: 'Firewall',
    indicators: ['ioc-001'],
  },
  {
    id: 'alert-005',
    title: 'Medium: Port Scanning Detected',
    description: 'External host performing reconnaissance scanning on public-facing infrastructure.',
    severity: 'medium',
    status: 'resolved',
    timestamp: '2024-01-20T10:15:00Z',
    source: 'Perimeter IDS',
    indicators: ['ioc-005'],
    assignee: 'Lisa Park',
  },
  {
    id: 'alert-006',
    title: 'Banking Trojan Communication',
    description: 'Emotet banking trojan C2 communication detected. Multiple endpoints may be affected.',
    severity: 'high',
    status: 'investigating',
    timestamp: '2024-01-20T09:00:00Z',
    source: 'Proxy Logs',
    indicators: ['ioc-007'],
    assignee: 'Sarah Chen',
  },
]

// Threat Feeds
export const mockThreatFeeds: ThreatFeed[] = [
  { id: 'feed-001', name: 'VirusTotal', status: 'active', lastUpdate: '2024-01-20T15:00:00Z', indicatorCount: 125847, reliability: 98 },
  { id: 'feed-002', name: 'AbuseIPDB', status: 'active', lastUpdate: '2024-01-20T14:55:00Z', indicatorCount: 89234, reliability: 95 },
  { id: 'feed-003', name: 'AlienVault OTX', status: 'active', lastUpdate: '2024-01-20T14:45:00Z', indicatorCount: 234567, reliability: 92 },
  { id: 'feed-004', name: 'MalwareBazaar', status: 'active', lastUpdate: '2024-01-20T14:30:00Z', indicatorCount: 45678, reliability: 97 },
  { id: 'feed-005', name: 'URLhaus', status: 'active', lastUpdate: '2024-01-20T14:20:00Z', indicatorCount: 78901, reliability: 94 },
  { id: 'feed-006', name: 'PhishTank', status: 'error', lastUpdate: '2024-01-20T10:00:00Z', indicatorCount: 56789, reliability: 89 },
  { id: 'feed-007', name: 'Spamhaus', status: 'active', lastUpdate: '2024-01-20T14:50:00Z', indicatorCount: 167890, reliability: 96 },
  { id: 'feed-008', name: 'ThreatFox', status: 'active', lastUpdate: '2024-01-20T14:40:00Z', indicatorCount: 34567, reliability: 93 },
]

// CVE Entries
export const mockCVEs: CVEEntry[] = [
  {
    id: 'cve-001',
    cveId: 'CVE-2024-21887',
    title: 'Ivanti Connect Secure Authentication Bypass',
    description: 'A command injection vulnerability in web components of Ivanti Connect Secure and Ivanti Policy Secure allows an authenticated administrator to send specially crafted requests and execute arbitrary commands.',
    cvssScore: 9.8,
    severity: 'critical',
    publishedDate: '2024-01-10T00:00:00Z',
    modifiedDate: '2024-01-18T00:00:00Z',
    affectedProducts: ['Ivanti Connect Secure 9.x', 'Ivanti Connect Secure 22.x', 'Ivanti Policy Secure'],
    exploitAvailable: true,
    patchAvailable: true,
    references: ['https://www.ivanti.com/blog/security-update-for-ivanti-connect-secure'],
  },
  {
    id: 'cve-002',
    cveId: 'CVE-2024-0519',
    title: 'Google Chrome V8 Out of Bounds Memory Access',
    description: 'Out of bounds memory access in V8 in Google Chrome prior to 120.0.6099.224 allowed a remote attacker to potentially exploit heap corruption via a crafted HTML page.',
    cvssScore: 8.8,
    severity: 'high',
    publishedDate: '2024-01-16T00:00:00Z',
    modifiedDate: '2024-01-19T00:00:00Z',
    affectedProducts: ['Google Chrome < 120.0.6099.224'],
    exploitAvailable: true,
    patchAvailable: true,
    references: ['https://chromereleases.googleblog.com/2024/01/stable-channel-update-for-desktop_16.html'],
  },
  {
    id: 'cve-003',
    cveId: 'CVE-2024-20253',
    title: 'Cisco Unified Communications Manager RCE',
    description: 'A vulnerability in multiple Cisco Unified Communications Manager products could allow an unauthenticated, remote attacker to execute arbitrary code on an affected device.',
    cvssScore: 9.9,
    severity: 'critical',
    publishedDate: '2024-01-24T00:00:00Z',
    modifiedDate: '2024-01-24T00:00:00Z',
    affectedProducts: ['Cisco CUCM', 'Cisco CUCM SME', 'Cisco Unity Connection'],
    exploitAvailable: false,
    patchAvailable: true,
    references: ['https://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/cisco-sa-cucm-rce-bWNzQcUm'],
  },
  {
    id: 'cve-004',
    cveId: 'CVE-2024-21413',
    title: 'Microsoft Outlook Remote Code Execution',
    description: 'Microsoft Outlook Remote Code Execution Vulnerability allows attackers to execute arbitrary code through malicious email links.',
    cvssScore: 9.8,
    severity: 'critical',
    publishedDate: '2024-02-13T00:00:00Z',
    modifiedDate: '2024-02-14T00:00:00Z',
    affectedProducts: ['Microsoft Outlook 2016', 'Microsoft Outlook 2019', 'Microsoft 365 Apps'],
    exploitAvailable: true,
    patchAvailable: true,
    references: ['https://msrc.microsoft.com/update-guide/vulnerability/CVE-2024-21413'],
  },
  {
    id: 'cve-005',
    cveId: 'CVE-2024-1086',
    title: 'Linux Kernel nf_tables Use-After-Free',
    description: 'A use-after-free vulnerability in the nf_tables component of the Linux kernel netfilter subsystem allows local privilege escalation.',
    cvssScore: 7.8,
    severity: 'high',
    publishedDate: '2024-01-31T00:00:00Z',
    modifiedDate: '2024-02-05T00:00:00Z',
    affectedProducts: ['Linux Kernel 5.14 - 6.6'],
    exploitAvailable: true,
    patchAvailable: true,
    references: ['https://www.cve.org/CVERecord?id=CVE-2024-1086'],
  },
  {
    id: 'cve-006',
    cveId: 'CVE-2024-23897',
    title: 'Jenkins Arbitrary File Read',
    description: 'Jenkins CLI allows attackers to read arbitrary files on the Jenkins controller file system using the build-in CLI command parser.',
    cvssScore: 9.1,
    severity: 'critical',
    publishedDate: '2024-01-24T00:00:00Z',
    modifiedDate: '2024-01-26T00:00:00Z',
    affectedProducts: ['Jenkins <= 2.441', 'Jenkins LTS <= 2.426.2'],
    exploitAvailable: true,
    patchAvailable: true,
    references: ['https://www.jenkins.io/security/advisory/2024-01-24/'],
  },
]

// Watchlist Items
export const mockWatchlist: WatchlistItem[] = [
  {
    id: 'watch-001',
    indicator: mockIndicators[0],
    addedDate: '2024-01-15T10:00:00Z',
    addedBy: 'John Smith',
    notes: 'Monitoring for APT29 campaign activity',
    alertOnChange: true,
    lastChecked: '2024-01-20T15:00:00Z',
  },
  {
    id: 'watch-002',
    indicator: mockIndicators[2],
    addedDate: '2024-01-18T16:30:00Z',
    addedBy: 'Sarah Chen',
    notes: 'LockBit 3.0 hash - tracking ransomware variants',
    alertOnChange: true,
    lastChecked: '2024-01-20T14:55:00Z',
  },
  {
    id: 'watch-003',
    indicator: mockIndicators[5],
    addedDate: '2024-01-05T08:00:00Z',
    addedBy: 'Mike Johnson',
    notes: 'C2 infrastructure - potential nation-state activity',
    alertOnChange: true,
    lastChecked: '2024-01-20T15:05:00Z',
  },
]

// Reports
export const mockReports: Report[] = [
  { id: 'report-001', title: 'Weekly IOC Summary Report', type: 'ioc_summary', generatedDate: '2024-01-20T06:00:00Z', period: 'Jan 13-20, 2024', status: 'ready' },
  { id: 'report-002', title: 'Threat Intelligence Analysis - APT Groups', type: 'threat_analysis', generatedDate: '2024-01-19T18:00:00Z', period: 'Q1 2024', status: 'ready' },
  { id: 'report-003', title: 'Critical CVE Summary', type: 'cve_summary', generatedDate: '2024-01-20T08:00:00Z', period: 'Jan 2024', status: 'ready' },
  { id: 'report-004', title: 'Monthly Security Incident Report', type: 'incident_report', generatedDate: '2024-01-20T10:00:00Z', period: 'December 2023', status: 'generating' },
  { id: 'report-005', title: 'Ransomware Trend Analysis', type: 'threat_analysis', generatedDate: '2024-01-15T12:00:00Z', period: 'H2 2023', status: 'ready' },
]

// Threat Correlations
export const mockCorrelations: ThreatCorrelation[] = [
  {
    id: 'corr-001',
    indicators: [mockIndicators[0], mockIndicators[2], mockIndicators[5]],
    attackCluster: 'APT29 / Cozy Bear',
    confidence: 87,
    firstSeen: '2024-01-05T00:00:00Z',
    lastSeen: '2024-01-20T14:00:00Z',
    sources: ['CrowdStrike', 'Mandiant', 'MISP'],
    ttps: ['T1566 - Phishing', 'T1059 - Command and Scripting', 'T1486 - Data Encrypted for Impact'],
  },
  {
    id: 'corr-002',
    indicators: [mockIndicators[1], mockIndicators[3]],
    attackCluster: 'FIN7 / Carbanak',
    confidence: 78,
    firstSeen: '2024-01-10T00:00:00Z',
    lastSeen: '2024-01-19T09:00:00Z',
    sources: ['Recorded Future', 'ThreatConnect'],
    ttps: ['T1566.001 - Spearphishing Attachment', 'T1055 - Process Injection'],
  },
  {
    id: 'corr-003',
    indicators: [mockIndicators[6]],
    attackCluster: 'TA551 / Shathak',
    confidence: 92,
    firstSeen: '2024-01-14T00:00:00Z',
    lastSeen: '2024-01-19T16:00:00Z',
    sources: ['Proofpoint', 'Cofense'],
    ttps: ['T1566.001 - Spearphishing Attachment', 'T1204 - User Execution', 'T1055 - Process Injection'],
  },
]

// Activity Log
export const mockActivityLog: ActivityLogEntry[] = [
  { id: 'log-001', timestamp: '2024-01-20T15:10:00Z', user: 'John Smith', action: 'Alert Acknowledged', details: 'Acknowledged alert: Ransomware Activity Detected', category: 'alert' },
  { id: 'log-002', timestamp: '2024-01-20T15:05:00Z', user: 'Sarah Chen', action: 'Investigation Started', details: 'Started investigation for phishing campaign targeting finance', category: 'investigation' },
  { id: 'log-003', timestamp: '2024-01-20T14:55:00Z', user: 'System', action: 'Threat Feed Updated', details: 'VirusTotal feed synchronized - 1,247 new indicators', category: 'configuration' },
  { id: 'log-004', timestamp: '2024-01-20T14:45:00Z', user: 'Mike Johnson', action: 'IOC Added to Watchlist', details: 'Added C2 domain c2-server-alpha.net to watchlist', category: 'investigation' },
  { id: 'log-005', timestamp: '2024-01-20T14:30:00Z', user: 'Lisa Park', action: 'Alert Resolved', details: 'Resolved alert: Port Scanning Detected - False positive', category: 'alert' },
  { id: 'log-006', timestamp: '2024-01-20T14:20:00Z', user: 'System', action: 'Report Generated', details: 'Weekly IOC Summary Report generation completed', category: 'report' },
  { id: 'log-007', timestamp: '2024-01-20T14:10:00Z', user: 'Sarah Chen', action: 'Indicator Enriched', details: 'Enriched IP 185.220.101.45 with additional threat intelligence', category: 'investigation' },
  { id: 'log-008', timestamp: '2024-01-20T14:00:00Z', user: 'John Smith', action: 'Rule Updated', details: 'Updated detection rule for Cobalt Strike beacons', category: 'configuration' },
]

// System Health
export const mockSystemHealth: SystemHealth[] = [
  { service: 'Threat Intelligence Engine', status: 'operational', latency: 45, lastCheck: '2024-01-20T15:10:00Z', uptime: 99.98 },
  { service: 'IOC Database', status: 'operational', latency: 12, lastCheck: '2024-01-20T15:10:00Z', uptime: 99.99 },
  { service: 'Alert Processing', status: 'operational', latency: 28, lastCheck: '2024-01-20T15:10:00Z', uptime: 99.95 },
  { service: 'Feed Aggregator', status: 'degraded', latency: 320, lastCheck: '2024-01-20T15:10:00Z', uptime: 98.5 },
  { service: 'Correlation Engine', status: 'operational', latency: 156, lastCheck: '2024-01-20T15:10:00Z', uptime: 99.92 },
  { service: 'Report Generator', status: 'operational', latency: 89, lastCheck: '2024-01-20T15:10:00Z', uptime: 99.87 },
]

// Geo Attack Data
export const mockGeoAttackData: GeoAttackData[] = [
  { country: 'Russia', countryCode: 'RU', attackCount: 2847, percentage: 24.5 },
  { country: 'China', countryCode: 'CN', attackCount: 2234, percentage: 19.2 },
  { country: 'United States', countryCode: 'US', attackCount: 1567, percentage: 13.5 },
  { country: 'Iran', countryCode: 'IR', attackCount: 1123, percentage: 9.7 },
  { country: 'North Korea', countryCode: 'KP', attackCount: 892, percentage: 7.7 },
  { country: 'Brazil', countryCode: 'BR', attackCount: 654, percentage: 5.6 },
  { country: 'India', countryCode: 'IN', attackCount: 543, percentage: 4.7 },
  { country: 'Vietnam', countryCode: 'VN', attackCount: 432, percentage: 3.7 },
  { country: 'Germany', countryCode: 'DE', attackCount: 321, percentage: 2.8 },
  { country: 'Netherlands', countryCode: 'NL', attackCount: 287, percentage: 2.5 },
]

// Chart Data
export const threatTrendData: ChartDataPoint[] = [
  { name: 'Jan 14', critical: 12, high: 45, medium: 78, low: 134 },
  { name: 'Jan 15', critical: 8, high: 52, medium: 82, low: 128 },
  { name: 'Jan 16', critical: 15, high: 48, medium: 75, low: 142 },
  { name: 'Jan 17', critical: 22, high: 61, medium: 89, low: 156 },
  { name: 'Jan 18', critical: 18, high: 55, medium: 92, low: 148 },
  { name: 'Jan 19', critical: 25, high: 67, medium: 85, low: 162 },
  { name: 'Jan 20', critical: 31, high: 72, medium: 98, low: 175 },
]

export const attackCategoryData: ChartDataPoint[] = [
  { name: 'Ransomware', value: 28 },
  { name: 'Phishing', value: 35 },
  { name: 'C2 Activity', value: 18 },
  { name: 'Data Exfil', value: 12 },
  { name: 'Recon', value: 7 },
]

export const sourceContributionData: ChartDataPoint[] = [
  { name: 'VirusTotal', value: 32 },
  { name: 'AbuseIPDB', value: 24 },
  { name: 'AlienVault', value: 18 },
  { name: 'MalwareBazaar', value: 14 },
  { name: 'Internal', value: 12 },
]

export const hourlyActivityData: ChartDataPoint[] = Array.from({ length: 24 }, (_, i) => ({
  name: `${i.toString().padStart(2, '0')}:00`,
  threats: Math.floor(Math.random() * 50) + 10,
  alerts: Math.floor(Math.random() * 20) + 5,
}))

// Dashboard Stats
export const dashboardStats = {
  totalThreats: 11624,
  activeIOCs: 8934,
  criticalAlerts: 6,
  feedsActive: 7,
  threatsToday: 276,
  threatsChange: 12.5,
  alertsToday: 23,
  alertsChange: -8.3,
}
