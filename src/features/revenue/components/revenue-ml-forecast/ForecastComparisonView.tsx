import { Download, TrendingUp, Layers, Box, Globe, MousePointer2 } from 'lucide-react'
import React, { memo } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  ComposedChart
} from 'recharts'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { RevenueMlForecastComparisonScenario } from '@/types/revenue.types'
import { cn } from '@/lib/utils'

interface ForecastComparisonViewProps {
  scenarios: RevenueMlForecastComparisonScenario[]
  onExport: () => void
}

export const ForecastComparisonView = memo<ForecastComparisonViewProps>(({ scenarios, onExport }) => {
  // Transform data for Recharts
  const chartData = scenarios[0]?.points.map((p, index) => {
    const point: Record<string, string | number> = { label: p.label }
    scenarios.forEach((s) => {
      point[s.id] = s.points[index]?.value
    })
    return point
  })

  return (
    <div className="flex flex-col bg-white">
      {/* Header Deck */}
      <div className="flex flex-row items-center justify-between p-6 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center">
            <Layers className="h-5 w-5 text-primary-400" />
          </div>
          <div>
            <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-widest">Scenario Comparison Deck</CardTitle>
            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5 tracking-tight">Cross-referencing multiple growth hypotheses</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 h-10 px-4 border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50" 
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          Export Datasets
        </Button>
      </div>

      <div className="p-6 space-y-8">
        {/* Immersive Comparison Chart */}
        <div className="h-[360px] w-full bg-slate-50/30 rounded-3xl border border-slate-100 p-6 relative group">
          <div className="absolute top-4 right-8 flex items-center gap-2">
            <MousePointer2 className="h-3 w-3 text-slate-300" />
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Interactive Data Stage</span>
          </div>
          
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <defs>
                {scenarios.map(s => (
                  <linearGradient key={`grad-${s.id}`} id={`grad-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={s.color} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--secondary-100))" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 700 }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))', fontWeight: 700 }}
                tickFormatter={(val) => `${(val / 1_000_000).toFixed(0)}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}
                labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginBottom: '8px', fontWeight: 800 }}
                formatter={(val: number | string) => [
                  new Intl.NumberFormat('vi-VN').format(Number(val)) + ' đ',
                  '',
                ]}
              />
              <Legend 
                verticalAlign="top" 
                height={50} 
                iconType="rect" 
                iconSize={10}
                wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}
              />
              {scenarios.map((s, index) => (
                <React.Fragment key={s.id}>
                  <Area
                    type="monotone"
                    dataKey={s.id}
                    stroke="none"
                    fill={`url(#grad-${s.id})`}
                    animationDuration={1000 + index * 500}
                  />
                  <Line
                    type="monotone"
                    dataKey={s.id}
                    name={s.title}
                    stroke={s.color}
                    strokeWidth={index === 0 ? 3 : 2}
                    strokeDasharray={index === 0 ? "0" : "5 5"}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0, fill: s.color }}
                    animationDuration={1500 + index * 500}
                  />
                </React.Fragment>
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Industrial Data Table */}
        <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm shadow-slate-200/50">
          <Table>
            <TableHeader className="bg-slate-900 border-none">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-white text-[10px] font-black uppercase tracking-widest pl-6">Scenario Identifier</TableHead>
                <TableHead className="text-white text-[10px] font-black uppercase tracking-widest text-right">Projected Value</TableHead>
                <TableHead className="text-white text-[10px] font-black uppercase tracking-widest text-right">Growth Rate</TableHead>
                <TableHead className="text-white text-[10px] font-black uppercase tracking-widest text-right">Efficiency (ROI)</TableHead>
                <TableHead className="text-white text-[10px] font-black uppercase tracking-widest text-right pr-6">System Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarios.map((s, idx) => (
                <TableRow key={s.id} className={cn(
                  "group transition-all duration-300",
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                )}>
                  <TableCell className="pl-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center border border-slate-100 shadow-sm bg-white group-hover:scale-110 transition-transform">
                        <Box className="h-4 w-4" style={{ color: s.color }} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{s.title}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">{s.note}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <span className="text-xs font-black font-mono text-slate-900">
                      {new Intl.NumberFormat('vi-VN').format(s.projectedRevenue)} đ
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex items-center justify-end gap-1">
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      <span className="text-xs font-black text-emerald-600">{s.metrics.growth}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-4">
                    <span className="text-xs font-black font-mono text-slate-600">
                      {s.metrics.roi ? `${s.metrics.roi}x` : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <Badge
                      variant={s.accent === 'positive' ? 'success' : s.accent === 'negative' ? 'danger' : 'neutral'}
                      className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                    >
                      {s.accent === 'positive' ? 'Optimistic' : s.accent === 'negative' ? 'Critical' : 'Stable'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
})

ForecastComparisonView.displayName = 'ForecastComparisonView'
