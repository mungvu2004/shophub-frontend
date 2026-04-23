import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from 'recharts'
import { AlertCircle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react'

import type {
  RevenueMlForecastChannelBreakdown,
  RevenueMlForecastKeyDriver,
} from '@/features/revenue/logic/revenueMlForecast.types'
import { cn } from '@/lib/utils'

const currencyFormatter = new Intl.NumberFormat('vi-VN')

export function RevenueMlForecastBusinessContextSection({
  channelBreakdown,
  targetRevenue,
  gapToTarget,
  currentRevenue,
  keyDrivers,
}: {
  channelBreakdown: RevenueMlForecastChannelBreakdown[]
  targetRevenue: number
  gapToTarget: number
  currentRevenue: number
  keyDrivers: RevenueMlForecastKeyDriver[]
}) {
  const totalRevenue = channelBreakdown.reduce((sum, item) => sum + item.revenue, 0)
  const targetProgress = targetRevenue > 0 ? Math.min(100, Math.max(0, (currentRevenue / targetRevenue) * 100)) : 0
  const isAhead = gapToTarget <= 0
  const spendLabel = currencyFormatter.format(Math.round(totalRevenue / 1_000_000))

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.08)] md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[1.3px] text-[#3525cd]">Business context</p>
          <h2 className="mt-1 text-[20px] font-bold tracking-[-0.3px] text-slate-950 md:text-[22px]">Phân rã, mục tiêu và động lực</h2>
        </div>
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600">
          Tổng quan doanh thu: {spendLabel}M
        </span>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.1fr,0.95fr,0.95fr]">
        <article className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.9px] text-slate-700">Phân rã nguồn doanh thu</h3>
              <p className="mt-1 text-[12px] text-slate-500">Tỷ trọng theo từng kênh bán</p>
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">4 kênh</span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[0.95fr,1.05fr] md:items-center">
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={channelBreakdown} dataKey="revenue" nameKey="channel" innerRadius={58} outerRadius={84} paddingAngle={2}>
                    {channelBreakdown.map((item) => (
                      <Cell key={item.channel} fill={item.colorHex} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2.5">
              {channelBreakdown.map((item) => (
                <div key={item.channel} className="flex items-center justify-between rounded-xl bg-white px-3 py-2.5 ring-1 ring-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: item.colorHex }} />
                    <div>
                      <p className="text-[12px] font-semibold text-slate-800">{item.channel}</p>
                      <p className="text-[11px] text-slate-500">{item.percentage}%</p>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold text-slate-900">{currencyFormatter.format(Math.round(item.revenue / 1_000_000))}M</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-indigo-50/40 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.9px] text-slate-700">Mục tiêu kinh doanh</h3>
              <p className="mt-1 text-[12px] text-slate-500">So sánh forecast với target</p>
            </div>
            <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold', isAhead ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700')}>
              {isAhead ? 'Vượt mục tiêu' : 'Còn thiếu'}
            </span>
          </div>

          <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] text-slate-500">Gap to target</p>
                <p className={cn('mt-1 text-[22px] font-bold tracking-[-0.3px]', isAhead ? 'text-emerald-600' : 'text-rose-600')}>
                  {isAhead ? 'Vượt ' : 'Còn thiếu '}{currencyFormatter.format(Math.abs(gapToTarget))}₫
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-500">Current / Target</p>
                <p className="mt-1 text-[13px] font-semibold text-slate-900">
                  {currencyFormatter.format(Math.round(currentRevenue / 1_000_000))}M / {currencyFormatter.format(Math.round(targetRevenue / 1_000_000))}M
                </p>
              </div>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn('h-full rounded-full transition-all', isAhead ? 'bg-emerald-500' : 'bg-[#3525cd]')}
                style={{ width: `${targetProgress}%` }}
              />
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
              Nếu chạm target, ưu tiên đẩy campaign remarketing và chốt nhóm khách hàng có xác suất mua cao.
            </p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-emerald-50/40 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.9px] text-slate-700">Động lực ảnh hưởng</h3>
              <p className="mt-1 text-[12px] text-slate-500">Các yếu tố chính đang kéo forecast</p>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700">Top drivers</span>
          </div>

          <div className="mt-4 space-y-2.5">
            {keyDrivers.slice(0, 4).map((driver) => {
              const impactWidth = Math.min(100, Math.abs(driver.impact) * 5)

              return (
                <div key={driver.id} className={cn('rounded-xl border px-3 py-2.5', driver.trend === 'positive' ? 'border-emerald-100 bg-emerald-50/70' : 'border-rose-100 bg-rose-50/70')}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[12px] font-semibold text-slate-800">{driver.label}</p>
                    <span className={cn('text-[11px] font-bold', driver.trend === 'positive' ? 'text-emerald-700' : 'text-rose-700')}>
                      {driver.trend === 'positive' ? '+' : ''}{driver.impact}%
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/80 ring-1 ring-slate-100">
                    <div className={cn('h-full rounded-full', driver.trend === 'positive' ? 'bg-emerald-500' : 'bg-rose-500')} style={{ width: `${impactWidth}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </article>
      </div>
    </section>
  )
}

export function RevenueMlForecastChannelBreakdownSection({
  channelBreakdown,
}: {
  channelBreakdown: RevenueMlForecastChannelBreakdown[]
}) {
  if (!channelBreakdown || channelBreakdown.length === 0) {
    return null
  }

  const total = channelBreakdown.reduce((sum, item) => sum + item.revenue, 0)
  const pieData = channelBreakdown.map((item) => ({
    name: item.channel,
    value: item.revenue,
    percentage: item.percentage,
    fill: item.colorHex,
  }))

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm px-7 py-7 shadow-[0_4px_12px_rgba(53,37,205,0.08)]">
      <h3 className="text-[14px] font-bold uppercase tracking-[0.8px] text-slate-700">Phân rã nguồn doanh thu</h3>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {channelBreakdown.map((item) => (
            <div key={item.channel} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 transition-colors hover:bg-indigo-50/50">
              <div className="flex items-center gap-3">
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: item.colorHex }}
                />
                <div>
                  <p className="text-[13px] font-semibold text-slate-800">{item.channel}</p>
                  <p className="text-[11px] text-slate-600">{item.percentage}% từ tổng doanh thu</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-bold text-indigo-600">{currencyFormatter.format(Math.round(item.revenue / 1000000))}M</p>
              </div>
            </div>
          ))}
          <div className="mt-4 flex justify-between border-t border-slate-200 pt-3">
            <p className="text-[13px] font-semibold text-slate-800">Tổng cộng</p>
            <p className="text-[12px] font-bold text-indigo-600">{currencyFormatter.format(Math.round(total / 1000000))}M</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function RevenueMlForecastHistoricalAccuracySection({
  historicalMape,
}: {
  historicalMape: number
}) {
  const accuracy = 100 - historicalMape
  const isGood = accuracy >= 95

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm px-7 py-7 shadow-[0_4px_12px_rgba(53,37,205,0.08)]">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'rounded-full p-3 shrink-0',
            isGood ? 'bg-emerald-100' : 'bg-amber-100'
          )}
        >
          {isGood ? (
            <CheckCircle className="size-5 text-emerald-600" />
          ) : (
            <AlertCircle className="size-5 text-amber-600" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-bold uppercase tracking-[0.8px] text-slate-700">Đánh giá độ chính xác</p>
          <h3 className="mt-1 text-[18px] font-bold text-slate-900">
            Model dự báo chính xác <span className={cn('text-lg', isGood ? 'text-emerald-600' : 'text-amber-600')}>{accuracy.toFixed(1)}%</span>
          </h3>
          <p className="mt-2 text-[13px] text-slate-600">
            Sai số trung bình (MAPE) tháng trước: <span className="font-semibold text-slate-900">{historicalMape.toFixed(1)}%</span>
          </p>
          <p className="mt-1.5 text-[12px] text-slate-500">
            Model được huấn luyện trên dữ liệu 12 tháng quá khứ. Độ chính xác được đánh giá dựa trên sai số trung bình phần trăm tuyệt đối.
          </p>
        </div>
      </div>
    </section>
  )
}

export function RevenueMlForecastTargetMetricsSection({
  targetRevenue,
  gapToTarget,
  currentRevenue,
}: {
  targetRevenue: number
  gapToTarget: number
  currentRevenue: number
}) {
  const achievePercent = currentRevenue > 0 ? (currentRevenue / targetRevenue) * 100 : 0
  const isAhead = gapToTarget <= 0

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm px-7 py-7 shadow-[0_4px_12px_rgba(53,37,205,0.08)]">
      <div className="flex items-start gap-4">
        <div className={cn('rounded-full p-3 shrink-0', isAhead ? 'bg-emerald-100' : 'bg-rose-100')}>
          {isAhead ? (
            <TrendingUp className="size-5 text-emerald-600" />
          ) : (
            <TrendingDown className="size-5 text-rose-600" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-bold uppercase tracking-[0.8px] text-slate-700">Mục tiêu kinh doanh</p>
          <h3 className="mt-1.5 text-[18px] font-bold text-slate-900">
            {isAhead ? (
              <>
                Vượt mục tiêu <span className="text-emerald-600">{currencyFormatter.format(Math.abs(gapToTarget))}</span>₫
              </>
            ) : (
              <>
                Còn thiếu <span className="text-rose-600">{currencyFormatter.format(gapToTarget)}</span>₫
              </>
            )}
          </h3>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-[12px]">
              <span className="text-slate-600">Tiến độ</span>
              <span className={cn('font-bold', isAhead ? 'text-emerald-600' : 'text-slate-900')}>
                {achievePercent.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={cn('h-full transition-all duration-300', isAhead ? 'bg-emerald-500' : 'bg-indigo-500')}
                style={{ width: `${Math.min(achievePercent, 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-[11px] text-slate-600">Mục tiêu</p>
              <p className="text-[12px] font-bold text-slate-900 mt-1">{currencyFormatter.format(Math.round(targetRevenue / 1000000))}M</p>
            </div>
            <div className="rounded-lg bg-indigo-50 p-3">
              <p className="text-[11px] text-slate-600">Dự báo hiện tại</p>
              <p className="text-[12px] font-bold text-indigo-600 mt-1">{currencyFormatter.format(Math.round(currentRevenue / 1000000))}M</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function RevenueMlForecastKeyDriversSection({
  keyDrivers,
}: {
  keyDrivers: RevenueMlForecastKeyDriver[]
}) {
  if (!keyDrivers || keyDrivers.length === 0) {
    return null
  }

  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm px-7 py-7 shadow-[0_4px_12px_rgba(53,37,205,0.08)]">
      <h3 className="text-[14px] font-bold uppercase tracking-[0.8px] text-slate-700">Động lực ảnh hưởng</h3>
      <p className="mt-1 text-[12px] text-slate-600">Những yếu tố chính đang tác động đến dự báo doanh thu</p>

      <div className="mt-5 space-y-3">
        {keyDrivers.map((driver) => (
          <div
            key={driver.id}
            className={cn(
              'rounded-lg border px-4 py-3 transition-colors',
              driver.trend === 'positive'
                ? 'border-emerald-200/60 bg-emerald-50/40'
                : 'border-rose-200/60 bg-rose-50/40'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'rounded-full p-2 shrink-0',
                  driver.trend === 'positive' ? 'bg-emerald-100' : 'bg-rose-100'
                )}
              >
                {driver.trend === 'positive' ? (
                  <TrendingUp className="size-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="size-4 text-rose-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-slate-800">{driver.label}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full', driver.trend === 'positive' ? 'bg-emerald-500' : 'bg-rose-500')}
                      style={{ width: `${driver.impact}%` }}
                    />
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  'text-[12px] font-bold shrink-0 px-2 py-1 rounded',
                  driver.trend === 'positive'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                )}
              >
                {driver.trend === 'positive' ? '+' : ''}{driver.impact}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
