import type { OrdersReturnsReasonAnalysis as ReasonAnalysisModel } from '@/features/orders/logic/ordersReturns.types'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

type OrdersReturnsReasonAnalysisProps = {
  reasons: ReasonAnalysisModel[]
  aiInsightText: string
}

const reasonColorMap: Record<ReasonAnalysisModel['reason'], string> = {
  defective: '#ef4444', // rose-500
  wrong_item: '#f59e0b', // amber-500
  change_of_mind: '#94a3b8', // slate-400
  late_delivery: '#6366f1', // indigo-500
  other: '#cbd5e1', // slate-300
}

export function OrdersReturnsReasonAnalysis({ reasons, aiInsightText }: OrdersReturnsReasonAnalysisProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-slate-100">Phân tích lý do hoàn trả</h3>
          <p className="text-[12px] text-slate-500 dark:text-slate-400">Dựa trên dữ liệu 30 ngày qua</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" />
          AI INSIGHT
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-6">
        {/* Chart Area */}
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={reasons}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                nameKey="label"
              >
                {reasons.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={reasonColorMap[entry.reason]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* List Area */}
        <div className="space-y-3">
          {reasons.map((item) => (
            <div key={item.reason} className="group space-y-1.5">
              <div className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full`} style={{ backgroundColor: reasonColorMap[item.reason] }} />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{item.percentage}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-1000 group-hover:opacity-80`}
                  style={{ width: `${item.percentage}%`, backgroundColor: reasonColorMap[item.reason] }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-indigo-50 bg-indigo-50/30 p-4 dark:border-indigo-900/20 dark:bg-indigo-900/10">
          <p className="text-[12px] leading-relaxed text-slate-700 dark:text-slate-300">
            <span className="font-bold text-indigo-700 dark:text-indigo-400">AI Insight:</span> {aiInsightText || 'Hệ thống đang tổng hợp dữ liệu để đưa ra nhận xét...'}
          </p>
        </div>
      </div>
    </div>
  )
}
