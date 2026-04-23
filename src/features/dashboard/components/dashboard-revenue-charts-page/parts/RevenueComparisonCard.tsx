import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import type { RevenueChartsPlatformId, RevenueChartsWeeklyRowViewModel } from '@/features/dashboard/logic/dashboardRevenueCharts.types'

type RevenueComparisonCardProps = {
  title: string
  rows: RevenueChartsWeeklyRowViewModel[]
  selectedPlatform: RevenueChartsPlatformId
}

// Mock sparkline data (each week has a small trend)
const mockSparklineData = [
  { points: [{ v: 40 }, { v: 30 }, { v: 45 }, { v: 50 }, { v: 45 }, { v: 60 }] },
  { points: [{ v: 20 }, { v: 25 }, { v: 22 }, { v: 30 }, { v: 35 }, { v: 40 }] },
  { points: [{ v: 50 }, { v: 45 }, { v: 40 }, { v: 35 }, { v: 30 }, { v: 25 }] },
  { points: [{ v: 30 }, { v: 40 }, { v: 35 }, { v: 45 }, { v: 50 }, { v: 55 }] },
]

export function RevenueComparisonCard({ title, rows, selectedPlatform }: RevenueComparisonCardProps) {
  const showShopee = selectedPlatform === 'all' || selectedPlatform === 'shopee'
  const showLazada = selectedPlatform === 'all' || selectedPlatform === 'lazada'
  const showTiktok = selectedPlatform === 'all' || selectedPlatform === 'tiktok_shop'

  return (
    <section className="rounded-2xl border border-secondary-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md">
      <header className="px-8 py-6 border-b border-secondary-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
             <TrendingUp className="h-5 w-5" />
           </div>
           <h3 className="text-heading-3 text-secondary-900 leading-none">{title}</h3>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-secondary-50/50 border-b border-secondary-100">
            <tr>
              <th className="px-8 py-4 text-left text-overline text-secondary-500 whitespace-nowrap">Thời gian</th>
              {showShopee && <th className="px-4 py-4 text-right text-overline text-secondary-500 whitespace-nowrap">Shopee</th>}
              {showLazada && <th className="px-4 py-4 text-right text-overline text-secondary-500 whitespace-nowrap">Lazada</th>}
              {showTiktok && <th className="px-4 py-4 text-right text-overline text-secondary-500 whitespace-nowrap">TikTok Shop</th>}
              <th className="px-4 py-4 text-center text-overline text-secondary-500 whitespace-nowrap">Xu hướng & Tăng trưởng</th>
              <th className="px-8 py-4 text-right text-overline text-secondary-500 whitespace-nowrap">Tổng doanh thu</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-secondary-50">
            {rows.map((row, index) => (
              <tr key={row.id} className="group hover:bg-secondary-50/80 transition-all duration-200">
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="font-black text-secondary-900">{row.weekLabel.split(' (')[0]}</span>
                    <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-tighter mt-0.5">
                      {row.weekLabel.split(' (')[1].replace(')', '')}
                    </span>
                  </div>
                </td>
                {showShopee && (
                  <td className="px-4 py-5 text-right font-mono text-secondary-600 tabular-nums">{row.shopeeLabel}</td>
                )}
                {showLazada && (
                  <td className="px-4 py-5 text-right font-mono text-secondary-600 tabular-nums">{row.lazadaLabel}</td>
                )}
                {showTiktok && (
                  <td className="px-4 py-5 text-right font-mono text-secondary-600 tabular-nums">{row.tiktokShopLabel}</td>
                )}
                <td className="px-4 py-5">
                  <div className="flex items-center justify-center gap-6">
                    {/* Sparkline */}
                    <div className="h-8 w-16 opacity-60 group-hover:opacity-100 transition-opacity">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mockSparklineData[index % mockSparklineData.length].points}>
                          <Line 
                            type="monotone" 
                            dataKey="v" 
                            stroke={row.growthTone === 'up' ? '#16A34A' : '#DC2626'} 
                            strokeWidth={2} 
                            dot={false} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Growth Badge */}
                    <span className={`inline-flex min-w-[65px] items-center justify-center gap-1 px-2 py-1 rounded-lg text-xs font-black shadow-sm border ${
                      row.growthTone === 'up' 
                        ? 'bg-success-50 text-success-700 border-success-100' 
                        : 'bg-danger-50 text-danger-700 border-danger-100'
                    }`}>
                      {row.growthTone === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {row.growthLabel}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <span className="font-mono font-black text-secondary-900 tabular-nums text-base">{row.totalLabel}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
