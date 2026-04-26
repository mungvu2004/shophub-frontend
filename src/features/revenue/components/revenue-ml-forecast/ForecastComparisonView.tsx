import { Download, TrendingUp, Layers, Box, CheckCircle2 } from 'lucide-react'
import React, { memo } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { RevenueMlForecastComparisonScenario } from '@/types/revenue.types'
import { cn } from '@/lib/utils'

interface ForecastComparisonViewProps {
  scenarios: RevenueMlForecastComparisonScenario[]
  onExport: () => void
  comparedScenarioIds: string[]
  onToggleComparison: (id: string) => void
}

export const ForecastComparisonView = memo<ForecastComparisonViewProps>(({ 
  scenarios, 
  onExport,
  comparedScenarioIds,
  onToggleComparison
}) => {
  return (
    <div className="flex flex-col bg-white">
      {/* Header Desk */}
      <div className="flex flex-row items-center justify-between p-6 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-200 group-hover:rotate-6 transition-transform duration-500">
            <Layers className="h-5 w-5 text-primary-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">Bảng đối chiếu kịch bản</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-tight">So sánh hiệu quả giữa các giả định tăng trưởng</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-10 px-4 border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300" 
          onClick={onExport}
        >
          <Download className="h-3.5 w-3.5 mr-2" />
          Xuất dữ liệu
        </Button>
      </div>

      <div className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-12 h-12 text-center"></TableHead>
              <TableHead className="text-slate-400 text-[10px] font-black uppercase tracking-widest h-12">Kịch bản phân tích</TableHead>
              <TableHead className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-right h-12">Doanh thu dự kiến</TableHead>
              <TableHead className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-right h-12">Tỷ lệ tăng trưởng</TableHead>
              <TableHead className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-right h-12 pr-8 h-12">Đánh giá hệ thống</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios.map((s) => {
              const isSelected = comparedScenarioIds.includes(s.id)
              return (
                <TableRow 
                  key={s.id} 
                  className={cn(
                    "group transition-all duration-500 cursor-pointer border-slate-50/50",
                    isSelected ? "bg-indigo-50/40" : "hover:bg-slate-50/80"
                  )}
                  onClick={() => onToggleComparison(s.id)}
                >
                  <TableCell className="text-center py-5">
                    <div className={cn(
                      "size-5 mx-auto rounded-md border-2 flex items-center justify-center transition-all duration-300",
                      isSelected ? "bg-indigo-600 border-indigo-600 scale-110 shadow-md shadow-indigo-100" : "border-slate-200 bg-white"
                    )}>
                      {isSelected && <CheckCircle2 className="size-3.5 text-white animate-in zoom-in duration-300" />}
                    </div>
                  </TableCell>
                  <TableCell className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-transform group-hover:scale-125 duration-300" style={{ backgroundColor: s.color }} />
                      <div className="flex flex-col">
                        <span className={cn(
                          "text-xs font-black uppercase tracking-tight transition-colors duration-300",
                          isSelected ? "text-indigo-900" : "text-slate-800"
                        )}>{s.title}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{s.note}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-5 font-mono text-xs font-black text-slate-900 italic">
                    {new Intl.NumberFormat('vi-VN').format(s.projectedRevenue)} đ
                  </TableCell>
                  <TableCell className="text-right py-5">
                    <div className="flex items-center justify-end gap-1.5">
                      <TrendingUp className={cn("h-3.5 w-3.5", (s.metrics?.growth ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500")} />
                      <span className={cn("text-xs font-black transition-all duration-300 group-hover:scale-105", (s.metrics?.growth ?? 0) >= 0 ? "text-emerald-600" : "text-rose-600")}>
                        {(s.metrics?.growth ?? 0) > 0 ? '+' : ''}{s.metrics?.growth ?? 0}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8 py-5">
                    <Badge
                      variant={s.accent === 'positive' ? 'success' : s.accent === 'negative' ? 'danger' : 'neutral'}
                      className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border-none shadow-none group-hover:shadow-sm transition-all"
                    >
                      {s.accent === 'positive' ? 'Optimistic' : s.accent === 'negative' ? 'Critical' : 'Baseline'}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      
      {scenarios.length === 0 && (
        <div className="py-24 text-center space-y-3 animate-in fade-in duration-700">
          <div className="size-14 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-100 shadow-inner">
             <Box className="size-6 text-slate-200" />
          </div>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Chưa có dữ liệu mô phỏng</p>
        </div>
      )}
    </div>
  )
})

ForecastComparisonView.displayName = 'ForecastComparisonView'
