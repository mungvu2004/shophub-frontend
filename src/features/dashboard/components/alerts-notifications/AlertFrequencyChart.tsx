import React from 'react'
import { useAlertFrequency } from '@/features/dashboard/hooks/useAlertFrequency'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts'
import { BarChart3, HelpCircle } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-sm">
        <p className="mb-2 text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-primary-500" />
              <span className="text-xs font-bold text-slate-600">Tổng cảnh báo</span>
            </div>
            <span className="text-sm font-black text-slate-900">{payload[0].value}</span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-destructive" />
              <span className="text-xs font-bold text-slate-600">Nghiêm trọng</span>
            </div>
            <span className="text-sm font-black text-rose-600">{payload[1].value}</span>
          </div>
        </div>
        <div className="mt-3 border-t border-slate-100 pt-2">
          <p className="text-[10px] leading-relaxed text-slate-400 font-medium italic">
            * Tần suất cao vào các ngày campaign sàn (Shopee/Lazada).
          </p>
        </div>
      </div>
    )
  }
  return null
}

export const AlertFrequencyChart: React.FC = () => {
  const { data: frequencyData, isLoading } = useAlertFrequency()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent className="h-[300px]">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    )
  }

  const chartData = frequencyData?.map(item => ({
    ...item,
    displayDate: format(new Date(item.date), 'dd/MM', { locale: vi })
  }))

  return (
    <Card className="h-full border-slate-200/60 shadow-sm overflow-hidden bg-white">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 shadow-sm">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-extrabold text-slate-900 tracking-tight">
                Tần suất cảnh báo
              </CardTitle>
              <CardDescription className="text-xs font-medium text-slate-500">
                Thống kê sự cố phát sinh theo tuần
              </CardDescription>
            </div>
          </div>
          <HelpCircle className="size-4 text-slate-300 hover:text-primary-500 cursor-help transition-colors" />
        </div>
      </CardHeader>
      <CardContent className="h-[320px] p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.05} />
            <XAxis 
              dataKey="displayDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontWeight: 600 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--slate-100))', opacity: 0.4 }} />
            <Legend 
              verticalAlign="top" 
              align="right" 
              height={36} 
              iconType="circle" 
              wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingBottom: '20px' }} 
            />
            <Bar 
              name="Tất cả" 
              dataKey="count" 
              fill="hsl(var(--primary))" 
              radius={[6, 6, 0, 0]} 
              barSize={18}
              opacity={0.3}
            />
            <Bar 
              name="Khẩn cấp" 
              dataKey="criticalCount" 
              fill="hsl(var(--destructive))" 
              radius={[6, 6, 0, 0]} 
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
