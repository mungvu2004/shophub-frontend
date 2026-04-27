import { AlertCircle, Package, Store, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { formatNumber } from '@/lib/utils'
import type { CompetitorPlatform } from '@/features/products/logic/productsCompetitorTracking.types'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: React.ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
  colorClass: string
}

function KpiCard({ title, value, subtitle, icon, trend, colorClass }: KpiCardProps) {
  return (
    <Card className="relative overflow-hidden p-6 shadow-sm transition-all hover:shadow-md">
      <div className={`absolute right-0 top-0 h-24 w-24 translate-x-8 translate-y-[-20%] rounded-full opacity-10 ${colorClass}`} />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
          <div className="mt-2 flex items-center gap-2">
            {trend && (
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${trend.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {trend.value}
              </span>
            )}
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 ${colorClass.replace('bg-', 'text-')}`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

const PLATFORM_LABELS: Record<CompetitorPlatform | 'n/a', string> = {
  shopee: 'Shopee',
  tiktok_shop: 'TikTok Shop',
  lazada: 'Lazada',
  'n/a': 'N/A'
}

export function CompetitorKpiSection({ 
  totalProducts, 
  avgPriceDiff, 
  totalAlerts, 
  topPlatform 
}: { 
  totalProducts: number
  avgPriceDiff: number
  totalAlerts: number
  topPlatform: CompetitorPlatform | 'n/a'
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Sản phẩm theo dõi"
        value={formatNumber(totalProducts)}
        subtitle="Sản phẩm đang giám sát"
        icon={<Package className="size-6" />}
        colorClass="bg-blue-500"
      />
      <KpiCard
        title="Cảnh báo giá"
        value={totalAlerts}
        subtitle="Cần xử lý ngay"
        icon={<AlertCircle className="size-6" />}
        trend={{ value: 'Quan trọng', isPositive: false }}
        colorClass="bg-rose-500"
      />
      <KpiCard
        title="Chênh lệch giá TB"
        value={`${avgPriceDiff > 0 ? '+' : ''}${avgPriceDiff.toFixed(1)}%`}
        subtitle="So với giá thị trường"
        icon={<TrendingDown className="size-6" />}
        trend={{ 
          value: avgPriceDiff <= 0 ? 'Cạnh tranh' : 'Cao hơn', 
          isPositive: avgPriceDiff <= 0 
        }}
        colorClass={avgPriceDiff <= 0 ? 'bg-emerald-500' : 'bg-amber-500'}
      />
      <KpiCard
        title="Nền tảng cạnh tranh"
        value={PLATFORM_LABELS[topPlatform]}
        subtitle="Nhiều đối thủ nhất"
        icon={<Store className="size-6" />}
        colorClass="bg-indigo-500"
      />
    </div>
  )
}
