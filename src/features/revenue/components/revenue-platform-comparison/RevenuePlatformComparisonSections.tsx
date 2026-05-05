import type { ReactNode } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Download,
  Music2,
  RefreshCcw,
  Settings2,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  TrendingUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { NavbarDatePicker } from '@/components/layout/navbar/NavbarDatePicker'
import { Button } from '@/components/ui/button'
import type {
  RevenuePlatformCardViewModel,
  RevenuePlatformComparisonViewModel,
} from '@/features/revenue/logic/revenuePlatformComparison.logic'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'

const panelClassName = 'rounded-[28px] border border-slate-200/80 bg-white shadow-[0_30px_65px_-48px_rgba(15,23,42,0.45)]'

const platformStyle = {
  shopee: {
    color: '#EE4D2D',
    chipClassName: 'bg-[#FFF1EA] text-[#C33A16] border-[#FFD8CA]',
    iconClassName: 'bg-[#EE4D2D] text-white',
    cardTint: 'from-[#FFF7F3] to-white',
    softText: 'text-[#D64523]',
  },
  tiktok: {
    color: '#0F172A',
    chipClassName: 'bg-slate-100 text-slate-700 border-slate-200',
    iconClassName: 'bg-[#0F172A] text-white',
    cardTint: 'from-slate-100 to-white',
    softText: 'text-slate-700',
  },
  lazada: {
    color: '#2563EB',
    chipClassName: 'bg-[#ECF3FF] text-[#1E53B5] border-[#CDE0FF]',
    iconClassName: 'bg-[#2563EB] text-white',
    cardTint: 'from-[#F1F6FF] to-white',
    softText: 'text-[#1E53B5]',
  },
} as const

type TrendTooltipItem = {
  dataKey?: string | number
  name?: string
  value?: number | string
}

type TrendTooltipProps = {
  active?: boolean
  payload?: TrendTooltipItem[]
  label?: string
}

type RadarTooltipItem = {
  dataKey?: string | number
  value?: number | string
}

type RadarTooltipProps = {
  active?: boolean
  payload?: RadarTooltipItem[]
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

function RadarTooltip({ active, payload, label }: RadarTooltipProps) {
  if (!active || !payload?.length) {
    return null
  }

  const platformLabel: Record<string, string> = {
    shopee: 'Shopee',
    tiktok: 'TikTok Shop',
    lazada: 'Lazada',
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="mb-1 font-semibold text-slate-500">{label}</p>
      <div className="space-y-1">
        {payload.map((item) => {
          const key = String(item.dataKey ?? '')

          return (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="font-semibold text-slate-600">{platformLabel[key] ?? key}</span>
              <span className="font-bold text-slate-900">{Number(item.value ?? 0).toFixed(1)}%</span>
            </div>
          )
        })}
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

function SectionHeader({
  title,
  subtitle,
  icon,
}: {
  title: string
  subtitle: string
  icon: ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-lg font-black tracking-tight text-slate-900">{title}</h2>
        <p className="mt-1 text-xs font-medium text-slate-500">{subtitle}</p>
      </div>
      <span className="inline-flex size-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600">
        {icon}
      </span>
    </div>
  )
}

import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

type PlatformActions = {
  isProcessing: boolean
  isSyncing: boolean
  isExporting: boolean
  handleSync: (month: string) => Promise<void>
  handleExport: () => Promise<void>
  messages: {
    sync: string
    syncLoading: string
    export: string
    exportLoading: string
  }
}

export function RevenueComparisonHeader({
  title,
  subtitle,
  monthLabel,
  platformActions,
  selectedMonth,
}: {
  title: string
  subtitle: string
  monthLabel: string
  platformActions?: PlatformActions
  selectedMonth?: string
}) {
  const navigate = useNavigate()
  const selectedDate = useUIStore((state) => state.selectedDate)
  const setSelectedDate = useUIStore((state) => state.setSelectedDate)

  const handleOpenPlatformSettings = () => {
    navigate('/settings/platform-connections')
    toast.success('Đã chuyển đến trang cài đặt kết nối sàn.')
  }

  const handleSelectCurrentMonth = () => {
    const now = new Date()
    const firstDayOfCurrentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
    setSelectedDate(firstDayOfCurrentMonth)
    toast.success('Đã chuyển về dữ liệu tháng hiện tại.')
  }

  const handleExportReport = async () => {
    if (platformActions) {
      await platformActions.handleExport()
    } else {
      toast.success('Đang mở hộp thoại in/PDF...')
      window.print()
    }
  }

  const handleSyncData = async () => {
    if (platformActions && selectedMonth) {
      await platformActions.handleSync(selectedMonth)
    }
  }

  return (
    <ThemedPageHeader
      title={title}
      subtitle={subtitle}
      theme="revenue"
      badge={{ text: 'Scoreboard', icon: <Sparkles className="size-3.5" /> }}
    >
      <div className="flex w-full flex-col gap-3 sm:w-auto">
        <div className="flex items-center gap-2">
          <NavbarDatePicker selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-xl bg-white/80 text-slate-600 shadow-sm backdrop-blur"
            onClick={handleOpenPlatformSettings}
            aria-label="Cài đặt kết nối sàn"
          >
            <Settings2 className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="h-10 flex-1 rounded-xl bg-white/80 px-4 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur"
            onClick={handleSelectCurrentMonth}
            type="button"
          >
            {monthLabel}
          </Button>
        </div>

        <div className="flex gap-2">
          {platformActions && (
            <Button
              variant="outline"
              className="h-10 flex-1 rounded-xl bg-white/80 text-sm font-semibold shadow-sm backdrop-blur"
              onClick={handleSyncData}
              disabled={platformActions.isSyncing}
              isLoading={platformActions.isSyncing}
              loadingText={platformActions.messages.syncLoading}
              type="button"
            >
              <RefreshCcw className="mr-2 size-4" />
              {platformActions.messages.sync}
            </Button>
          )}
          <Button
            className="h-10 flex-1 rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            onClick={handleExportReport}
            disabled={platformActions?.isExporting}
            isLoading={platformActions?.isExporting}
            loadingText={platformActions?.messages.exportLoading}
            type="button"
          >
            <Download className="mr-2 size-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>
    </ThemedPageHeader>
  )
}

export function RevenueComparisonCards({ cards }: { cards: RevenuePlatformCardViewModel[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {cards.map((card) => {
        const styles = platformStyle[card.platform]

        return (
          <article
            key={card.id}
            className={cn(
              panelClassName,
              'bg-gradient-to-br p-5',
              styles.cardTint,
            )}
          >
            <header className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={cn('inline-flex size-9 items-center justify-center rounded-xl', styles.iconClassName)}>
                  <PlatformIcon platform={card.platform} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-slate-900">{card.name}</h3>
                  <p className="text-xs text-slate-500">Snapshot hiệu suất</p>
                </div>
              </div>

              <span className={cn('rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.45px]', styles.chipClassName)}>
                {card.badge}
              </span>
            </header>

            <div className="mt-4 flex items-end justify-between rounded-xl border border-white/80 bg-white/85 px-3 py-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-slate-500">Doanh thu</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{card.revenueLabel}</p>
              </div>
              <span className={cn('rounded-full px-2 py-0.5 text-xs font-bold', card.growthClassName, 'bg-white')}>
                {card.growthLabel}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2">
                <span className="text-xs font-semibold text-slate-500">Đơn hàng</span>
                <span className="text-sm font-black text-slate-900">{card.ordersLabel}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2">
                <span className="text-xs font-semibold text-slate-500">AOV</span>
                <span className="text-sm font-black text-slate-900">{card.aovLabel}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2">
                <span className="text-xs font-semibold text-slate-500">Phí sàn</span>
                <span className="text-sm font-black text-slate-900">{card.feeRateLabel}</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="rounded-lg border border-white/70 bg-white/85 px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.45px] text-slate-500">Tỷ lệ hoàn</p>
                <p className={cn('mt-1 text-base font-black', card.returnRateClassName)}>{card.returnRateLabel}</p>
              </div>

              <div className="rounded-lg border border-white/70 bg-white/85 px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.45px] text-slate-500">Net Margin</p>
                <p className={cn('mt-1 text-base font-black', card.netMarginClassName)}>{card.netMarginLabel}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-200/70 pt-3">
              <span className="text-xs font-semibold text-slate-500">Đánh giá trung bình</span>
              <span className={cn('inline-flex items-center gap-1 text-sm font-black', styles.softText)}>
                {card.ratingLabel}
                <Star className="size-4 fill-amber-400 text-amber-400" />
              </span>
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
  const radarData = model.comparisonMetrics.map((metric) => ({
    metric: metric.label,
    shopee: metric.values.find((item) => item.platform === 'shopee')?.percentage ?? 0,
    tiktok: metric.values.find((item) => item.platform === 'tiktok')?.percentage ?? 0,
    lazada: metric.values.find((item) => item.platform === 'lazada')?.percentage ?? 0,
  }))

  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <article className={cn(panelClassName, 'p-5')}>
        <SectionHeader
          title="Bản đồ năng lực KPI"
          subtitle="Radar chart cho góc nhìn tổng thể lợi thế từng nền tảng"
          icon={<Sparkles className="size-4" />}
        />

        <div className="h-[340px] rounded-2xl border border-slate-100 bg-slate-50/70 px-2 py-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="72%">
              <PolarGrid stroke="#D9E0EA" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#475569', fontWeight: 700 }} />
              <PolarRadiusAxis domain={[0, 110]} tickCount={5} tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip content={<RadarTooltip />} />
              <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 700 }} />
              <Radar name="Shopee" dataKey="shopee" stroke={platformStyle.shopee.color} fill={platformStyle.shopee.color} fillOpacity={0.16} strokeWidth={2} />
              <Radar name="TikTok Shop" dataKey="tiktok" stroke={platformStyle.tiktok.color} fill={platformStyle.tiktok.color} fillOpacity={0.12} strokeWidth={2} />
              <Radar name="Lazada" dataKey="lazada" stroke={platformStyle.lazada.color} fill={platformStyle.lazada.color} fillOpacity={0.14} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className={cn(panelClassName, 'p-5')}>
        <SectionHeader
          title="Dòng tăng trưởng doanh thu"
          subtitle="So sánh quỹ đạo doanh thu theo thời gian với lớp area trong suốt"
          icon={<TrendingUp className="size-4" />}
        />

        <div className="h-[340px] rounded-2xl border border-slate-100 bg-slate-50/70 px-2 py-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={model.trend} margin={{ top: 6, right: 8, left: 8, bottom: 4 }}>
              <defs>
                <linearGradient id="trendShopee" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={platformStyle.shopee.color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={platformStyle.shopee.color} stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="trendTiktok" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={platformStyle.tiktok.color} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={platformStyle.tiktok.color} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="trendLazada" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={platformStyle.lazada.color} stopOpacity={0.22} />
                  <stop offset="95%" stopColor={platformStyle.lazada.color} stopOpacity={0.03} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="#DFE6EF" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: '#64748B', fontSize: 12, fontWeight: 700 }}
              />
              <YAxis hide />
              <Tooltip content={<TrendTooltip />} cursor={{ stroke: '#94A3B8', strokeDasharray: '4 4' }} />

              <Area type="linear" dataKey="shopee" name="Shopee" stroke={platformStyle.shopee.color} fill="url(#trendShopee)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
              <Area type="linear" dataKey="tiktok" name="TikTok Shop" stroke={platformStyle.tiktok.color} fill="url(#trendTiktok)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
              <Area type="linear" dataKey="lazada" name="Lazada" stroke={platformStyle.lazada.color} fill="url(#trendLazada)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
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
    <section className={cn(panelClassName, 'bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5')}>
      <SectionHeader
        title={title}
        subtitle={subtitle}
        icon={<Sparkles className="size-4" />}
      />

      <div className="space-y-3">
        {items.map((item, index) => (
          <article
            key={item.id}
            className="grid grid-cols-[34px_1fr_auto] items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-black text-slate-600">
              {String(index + 1).padStart(2, '0')}
            </span>
            <p className="text-sm leading-6 text-slate-700">{item.message}</p>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-extrabold tracking-[0.45px] text-white">
              {item.confidenceLabel}
            </span>
          </article>
        ))}
      </div>
    </section>
  )
}
