
'use client'

import { useEffect, useMemo, useState } from 'react'

import { motion } from 'framer-motion'

import {
  FileText,
  Download,
  Clock,
  Calendar,
  Search,
  CheckCircle2,
  Loader2,
  Trash2,
  Shield,
  AlertTriangle,
  FileWarning,
  Bug,
  FileBarChart,
} from 'lucide-react'

import { DashboardLayout } from '@/components/layout/dashboard-layout'

import { GlassCard } from '@/components/ui/glass-card'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const API_BASE =
  'http://127.0.0.1:8000'

interface ReportItem {

  id: number

  report_name: string

  ioc: string

  ioc_type: string

  severity: string

  threat_score: number

  summary: string

  mitre_attack: string

  source_intelligence: string

  analyst_notes: string

  created_at: string
}

const reportTypeConfig = {

  low: {

    label: 'IOC Summary',

    icon: Shield,

    color:
      'text-primary bg-primary/10',

  },

  medium: {

    label: 'Threat Analysis',

    icon: FileWarning,

    color:
      'text-cyber-orange bg-cyber-orange/10',

  },

  high: {

    label: 'CVE Summary',

    icon: Bug,

    color:
      'text-cyber-red bg-cyber-red/10',

  },

  critical: {

    label: 'Incident Report',

    icon: FileBarChart,

    color:
      'text-cyber-yellow bg-cyber-yellow/10',

  },

}

export default function ReportsPage() {

  const [reports, setReports] =
    useState<ReportItem[]>([])

  const [loading, setLoading] =
    useState(true)

  const [searchQuery, setSearchQuery] =
    useState('')

  const [severityFilter, setSeverityFilter] =
    useState('all')

  const [open, setOpen] =
    useState(false)

  const [formData, setFormData] =
    useState({

      report_name: '',

      ioc: '',

      ioc_type: 'hash',

      severity: 'medium',

      threat_score: 50,

      summary: '',

      mitre_attack: '',

      source_intelligence:
        'VirusTotal, OTX, MalwareBazaar',

      analyst_notes: ''

    })

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null

  // =====================================================
  // FETCH REPORTS
  // =====================================================

  const fetchReports = async () => {

    try {

      const response = await fetch(

        `${API_BASE}/reports/history`,

        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      )

      const data =
        await response.json()

      setReports(data || [])

    } catch (error) {

      console.error(error)

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {

    fetchReports()

  }, [])

  // =====================================================
  // GENERATE REPORT
  // =====================================================

  const generateReport = async () => {

    try {

      const response = await fetch(

        `${API_BASE}/reports/generate`,

        {

          method: 'POST',

          headers: {

            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`

          },

          body: JSON.stringify(
            formData
          )

        }

      )

      if (response.ok) {

        setOpen(false)

        setFormData({

          report_name: '',

          ioc: '',

          ioc_type: 'hash',

          severity: 'medium',

          threat_score: 50,

          summary: '',

          mitre_attack: '',

          source_intelligence:
            'VirusTotal, OTX, MalwareBazaar',

          analyst_notes: ''

        })

        fetchReports()
      }

    } catch (error) {

      console.error(error)

    }
  }

  // =====================================================
  // DOWNLOAD PDF
  // =====================================================

  const downloadPDF = async (
    reportId: number
  ) => {

    try {

      const response = await fetch(

        `${API_BASE}/reports/download/${reportId}`,

        {

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      )

      const blob =
        await response.blob()

      const url =
        window.URL.createObjectURL(
          blob
        )

      const a =
        document.createElement('a')

      a.href = url

      a.download =
        `report_${reportId}.pdf`

      document.body.appendChild(a)

      a.click()

      a.remove()

    } catch (error) {

      console.error(error)

    }
  }

  // =====================================================
  // DELETE REPORT
  // =====================================================

  const deleteReport = async (
    reportId: number
  ) => {

    try {

      await fetch(

        `${API_BASE}/reports/${reportId}`,

        {

          method: 'DELETE',

          headers: {

            Authorization:
              `Bearer ${token}`

          }

        }

      )

      fetchReports()

    } catch (error) {

      console.error(error)

    }
  }

  // =====================================================
  // FILTER REPORTS
  // =====================================================

  const filteredReports =
    useMemo(() => {

      return reports.filter(
        (report) => {

          const matchesSearch =

            report.report_name
              .toLowerCase()
              .includes(
                searchQuery.toLowerCase()
              )

          const matchesSeverity =

            severityFilter ===
              'all'

            ||

            report.severity ===
              severityFilter

          return (
            matchesSearch &&
            matchesSeverity
          )
        }
      )

    }, [

      reports,

      searchQuery,

      severityFilter

    ])

  // =====================================================
  // STATS
  // =====================================================

  const stats = {

    total:
      reports.length,

    critical:
      reports.filter(
        (r) =>
          r.severity ===
          'critical'
      ).length,

    high:
      reports.filter(
        (r) =>
          r.severity ===
          'high'
      ).length,

    thisWeek:
      reports.filter((r) => {

        const reportDate =
          new Date(
            r.created_at
          )

        const weekAgo =
          new Date()

        weekAgo.setDate(
          weekAgo.getDate() - 7
        )

        return (
          reportDate >= weekAgo
        )

      }).length

  }

  return (

    <DashboardLayout>

      <div className="space-y-6">

        {/* ===================================================== */}
        {/* HEADER */}
        {/* ===================================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-2xl font-bold tracking-tight">

              Reports

            </h1>

            <p className="text-muted-foreground">

              Generate and download threat intelligence reports

            </p>

          </div>

          {/* ===================================================== */}
          {/* GENERATE REPORT */}
          {/* ===================================================== */}

          <Dialog
            open={open}
            onOpenChange={setOpen}
          >

            <DialogTrigger asChild>

              <Button className="bg-primary hover:bg-primary/90">

                <FileText className="mr-2 h-4 w-4" />

                Generate Report

              </Button>

            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] bg-card border-border">

              <DialogHeader>

                <DialogTitle>

                  Generate Threat Report

                </DialogTitle>

              </DialogHeader>

              <div className="space-y-4">

                <Input
                  placeholder="Report Name"
                  value={
                    formData.report_name
                  }
                  onChange={(e) =>
                    setFormData({

                      ...formData,

                      report_name:
                        e.target.value

                    })
                  }
                />

                <Input
                  placeholder="IOC"
                  value={formData.ioc}
                  onChange={(e) =>
                    setFormData({

                      ...formData,

                      ioc:
                        e.target.value

                    })
                  }
                />

                <Input
                  placeholder="IOC Type"
                  value={
                    formData.ioc_type
                  }
                  onChange={(e) =>
                    setFormData({

                      ...formData,

                      ioc_type:
                        e.target.value

                    })
                  }
                />

                <Input
                  placeholder="Severity"
                  value={
                    formData.severity
                  }
                  onChange={(e) =>
                    setFormData({

                      ...formData,

                      severity:
                        e.target.value

                    })
                  }
                />

                <Input
                  type="number"
                  placeholder="Threat Score"
                  value={
                    formData.threat_score
                  }
                  onChange={(e) =>
                    setFormData({

                      ...formData,

                      threat_score:
                        Number(
                          e.target.value
                        )

                    })
                  }
                />

                <Input
                  placeholder="MITRE ATT&CK"
                  value={
                    formData.mitre_attack
                  }
                  onChange={(e) =>
                    setFormData({

                      ...formData,

                      mitre_attack:
                        e.target.value

                    })
                  }
                />

                <Input
                  placeholder="Summary"
                  value={
                    formData.summary
                  }
                  onChange={(e) =>
                    setFormData({

                      ...formData,

                      summary:
                        e.target.value

                    })
                  }
                />

                <Input
                  placeholder="Analyst Notes"
                  value={
                    formData.analyst_notes
                  }
                  onChange={(e) =>
                    setFormData({

                      ...formData,

                      analyst_notes:
                        e.target.value

                    })
                  }
                />

                <Button
                  className="w-full"
                  onClick={
                    generateReport
                  }
                >

                  Generate Report

                </Button>

              </div>

            </DialogContent>

          </Dialog>

        </div>

        {/* ===================================================== */}
        {/* STATS */}
        {/* ===================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <GlassCard>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">

                <FileText className="h-5 w-5 text-primary" />

              </div>

              <div>

                <p className="text-2xl font-bold">

                  {stats.total}

                </p>

                <p className="text-xs text-muted-foreground">

                  Total Reports

                </p>

              </div>

            </div>

          </GlassCard>

          <GlassCard>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-red/10">

                <AlertTriangle className="h-5 w-5 text-cyber-red" />

              </div>

              <div>

                <p className="text-2xl font-bold">

                  {stats.critical}

                </p>

                <p className="text-xs text-muted-foreground">

                  Critical Reports

                </p>

              </div>

            </div>

          </GlassCard>

          <GlassCard>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-orange/10">

                <FileWarning className="h-5 w-5 text-cyber-orange" />

              </div>

              <div>

                <p className="text-2xl font-bold">

                  {stats.high}

                </p>

                <p className="text-xs text-muted-foreground">

                  High Severity

                </p>

              </div>

            </div>

          </GlassCard>

          <GlassCard>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-cyan/10">

                <Calendar className="h-5 w-5 text-cyber-cyan" />

              </div>

              <div>

                <p className="text-2xl font-bold">

                  {stats.thisWeek}

                </p>

                <p className="text-xs text-muted-foreground">

                  This Week

                </p>

              </div>

            </div>

          </GlassCard>

        </div>

        {/* ===================================================== */}
        {/* SEARCH */}
        {/* ===================================================== */}

        <GlassCard>

          <div className="relative">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input

              type="text"

              placeholder="Search reports..."

              value={searchQuery}

              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }

              className="pl-10 bg-secondary border-border"

            />

          </div>

        </GlassCard>

        {/* ===================================================== */}
        {/* REPORTS */}
        {/* ===================================================== */}

        <div className="space-y-4">

          {loading ? (

            <div className="flex justify-center py-10">

              <Loader2 className="h-8 w-8 animate-spin text-primary" />

            </div>

          ) : filteredReports.length === 0 ? (

            <div className="flex flex-col items-center justify-center py-20">

              <FileText className="h-12 w-12 text-muted-foreground mb-4" />

              <h3 className="text-lg font-medium mb-2">

                No Reports Found

              </h3>

            </div>

          ) : (

            filteredReports.map(

              (
                report,
                index
              ) => {

                const config =

                  reportTypeConfig[
                    report.severity as keyof typeof reportTypeConfig
                  ]

                const Icon =
                  config.icon

                return (

                  <motion.div

                    key={report.id}

                    initial={{
                      opacity: 0,
                      y: 20
                    }}

                    animate={{
                      opacity: 1,
                      y: 0
                    }}

                    transition={{
                      delay:
                        index * 0.05
                    }}

                  >

                    <GlassCard>

                      <div className="flex items-start gap-4">

                        <div className={cn(

                          'flex h-12 w-12 items-center justify-center rounded-lg shrink-0',

                          config.color

                        )}>

                          <Icon className="h-6 w-6" />

                        </div>

                        <div className="flex-1">

                          <div className="flex items-start justify-between gap-4">

                            <div>

                              <span className={cn(

                                'text-xs font-medium',

                                config.color.split(
                                  ' '
                                )[0]

                              )}>

                                {
                                  config.label
                                }

                              </span>

                              <h3 className="text-base font-medium mt-1">

                                {
                                  report.report_name
                                }

                              </h3>

                            </div>

                            <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-cyber-green/10 text-cyber-green text-xs">

                              <CheckCircle2 className="h-3 w-3" />

                              Ready

                            </span>

                          </div>

                          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">

                            <span className="flex items-center gap-1">

                              <Shield className="h-3 w-3" />

                              {report.ioc}

                            </span>

                            <span className="flex items-center gap-1">

                              <Clock className="h-3 w-3" />

                              {new Date(
                                report.created_at
                              ).toLocaleString()}

                            </span>

                          </div>

                          <p className="mt-4 text-sm text-muted-foreground">

                            {
                              report.summary
                            }

                          </p>

                          <div className="flex items-center gap-2 mt-5">

                            <Button
                              size="sm"
                              onClick={() =>
                                downloadPDF(
                                  report.id
                                )
                              }
                            >

                              <Download className="mr-2 h-4 w-4" />

                              Download PDF

                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                deleteReport(
                                  report.id
                                )
                              }
                            >

                              <Trash2 className="mr-2 h-4 w-4" />

                              Delete

                            </Button>

                          </div>

                        </div>

                      </div>

                    </GlassCard>

                  </motion.div>

                )
              }
            )

          )}

        </div>

      </div>

    </DashboardLayout>

  )
}

