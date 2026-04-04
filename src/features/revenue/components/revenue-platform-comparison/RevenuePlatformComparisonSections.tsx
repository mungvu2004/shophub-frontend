import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Download, Music2, ShoppingBag, Star, Store } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type {
  RevenuePlatformCardViewModel,
  RevenuePlatformComparisonViewModel,
} from '@/features/revenue/logic/revenuePlatformComparison.logic'
import { cn } from '@/lib/utils'

const platformStyle = {
  shopee: {
    color: '#EE4D2D',
    textClassName: 'text-[#EE4D2D]',
    accentClassName: 'border-t-[#EE4D2D]',
    iconClassName: 'bg-[#EE4D2D] text-white',
    badgeClassName: 'bg-[#EE4D2D]/10 text-[#EE4D2D]',
  },
  tiktok: {
    color: '#111111',
    textClassName: 'text-[#111111]',
    accentClassName: 'border-t-[#111111]',
    iconClassName: 'bg-[#111111] text-white',
    badgeClassName: 'bg-emerald-100 text-emerald-700',
  },
  lazada: {
    color: '#3525CD',
    textClassName: 'text-[#3525CD]',
    accentClassName: 'border-t-[#3525CD]',
    iconClassName: 'bg-[#3525CD] text-white',
    badgeClassName: 'bg-indigo-100 text-indigo-700',
  },
} as const

type TrendTooltipItem = {
  dataKey?: string | number
  name?: string
  value?: number | string
  color?: string
}

type TrendTooltipProps = {
  active?: boolean
  payload?: TrendTooltipItem[]
  label?: string
}

function TrendTooltip({ active, payload, label }: TrendTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="mb-1 font-semibold text-slate-500">{label}</p>
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.dataKey?.toString()} className="flex items-center justify-between gap-4">
            <span className="font-semibold text-slate-600">{item.name}</span>
            <span className="font-bold text-slate-900">{new Intl.NumberFormat('vi-VN').format(Number(item.value ?? 0))} đ</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PlatformIcon({ platform }: { platform: RevenuePlatformCardViewModel['platform'] }) {
  if (platform === 'shopee') {
    return <Store className="size-4" />
  }

  if (platform === 'tiktok') {
    return <Music2 className="size-4" />
  }

  return <ShoppingBag className="size-4" />
}

export function RevenueComparisonHeader({
  title,
  subtitle,
  monthLabel,
}: {
  title: string
  subtitle: string
  monthLabel: string
}) {
  return (
    <section className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[32px] font-bold tracking-[-0.4px] text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" className="h-10 rounded-lg px-4 text-sm font-semibold text-slate-900">
          {monthLabel}
        </Button>
        <Button variant="outline" className="h-10 rounded-lg px-4 text-sm font-semibold text-slate-600">
          <Download className="mr-2 size-4" />
          Xuất báo cáo
        </Button>
      </div>
    </section>
  )
}

export function RevenueComparisonCards({ cards }: { cards: RevenuePlatformCardViewModel[] }) {
  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {cards.map((card) => {
        const styles = platformStyle[card.platform]

        return (
          <article key={card.id} className={cn('rounded-2xl border border-slate-200 border-t-4 bg-white p-6 shadow-sm', styles.accentClassName)}>
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('inline-flex size-10 items-center justify-center rounded-lg', styles.iconClassName)}>
                  <PlatformIcon platform={card.platform} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{card.name}</h3>
              </div>
              <span className={cn('rounded px-2 py-1 text-[10px] font-bold uppercase tracking-[0.5px]', styles.badgeClassName)}>
                {card.badge}
              </span>
            </header>

            <div className="mt-6 space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.55px] text-slate-500">Doanh thu</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-3xl font-bold text-slate-900">{card.revenueLabel}</p>
                  <span className={cn('text-xs font-bold', card.growthClassName)}>{card.growthLabel}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.55px] text-slate-500">Đơn hàng</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{card.ordersLabel}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.55px] text-slate-500">Tỷ lệ hoàn</p>
                  <p className={cn('mt-1 text-2xl font-bold', card.returnRateClassName)}>{card.returnRateLabel}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.55px] text-slate-500">Giá trị TB (AOV)</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{card.aovLabel}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.55px] text-slate-500">Phí sàn</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{card.feeRateLabel}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#F0F3FF] pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.55px] text-slate-500">Rating trung bình</p>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-slate-900">{card.ratingLabel}</span>
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </section>
  )
}

export function RevenueComparisonKpiAndTrend({
  model,
}: {
  model: RevenuePlatformComparisonViewModel
}) {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[320px,1fr]">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">So sánh KPI theo sàn (%)</h2>
        <div className="mt-6 space-y-5">
          {model.comparisonMetrics.map((metric) => {
            const total = metric.values.reduce((acc, item) => acc + Math.max(item.percentage, 0), 0)

            return (
              <div key={metric.id}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.55px] text-slate-500">{metric.label}</p>
                <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="flex h-full w-full">
                    {metric.values.map((item) => {
                      const safePercent = total > 0 ? Math.round((item.percentage / total) * 100) : 0

                      return (
                        <div
                          key={`${metric.id}-${item.platform}`}
                          className="h-full"
                          style={{
                            width: `${safePercent}%`,
                            backgroundColor: platformStyle[item.platform].color,
                          }}
                          title={`${item.platform.toUpperCase()}: ${item.valueLabel}`}
                        />
                      )
                    })}
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-600">
                  {metric.values.map((item) => (
                    <span key={`${metric.id}-${item.platform}-label`} className="inline-flex items-center gap-1.5">
                      <span className="size-2 rounded-full" style={{ backgroundColor: platformStyle[item.platform].color }} />
                      <span className={platformStyle[item.platform].textClassName}>{item.valueLabel}</span>
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
          {model.trendLegend.map((item) => (
            <span key={item.key} className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Tăng trưởng doanh thu - 6 tháng gần nhất</h2>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            {model.trendLegend.map((item) => (
              <span key={item.key} className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ backgroundColor: platformStyle[item.key].color }} />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="h-[320px] border-b border-l border-[#F0F3FF] pb-1 pl-px pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={model.trend} margin={{ top: 6, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#F1F5F9" strokeWidth={1} />
              <YAxis hide />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={14}
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip content={<TrendTooltip />} cursor={{ stroke: '#CBD5E1', strokeDasharray: '4 4' }} />
              <Line type="monotone" dataKey="shopee" name="Shopee" stroke={platformStyle.shopee.color} strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="tiktok" name="TikTok Shop" stroke={platformStyle.tiktok.color} strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="lazada" name="Lazada" stroke={platformStyle.lazada.color} strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  )
}

export function RevenueComparisonInsights({
  title,
  subtitle,
  items,
}: {
  title: string
  subtitle: string
  items: RevenuePlatformComparisonViewModel['insights']
}) {
  return (
    <section className="rounded-2xl border border-[#D9DDF8] bg-[#F3F4FF] p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-[#312E81]">{title}</h2>
        <p className="mt-1 text-sm text-indigo-500">{subtitle}</p>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <article key={item.id} className="flex items-center justify-between gap-4 rounded-xl border border-white bg-white/80 px-4 py-4">
            <p className="text-sm font-medium text-slate-700">{item.message}</p>
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-[10px] font-extrabold tracking-[0.4px] text-indigo-700">
              {item.confidenceLabel}
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}
