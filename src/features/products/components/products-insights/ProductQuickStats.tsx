import { Card } from '@/components/ui/card'
import { PackageX, AlertTriangle, CloudOff, CircleDollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductQuickStatData } from '@/features/products/logic/productsListPage.types'

interface ProductQuickStatsProps {
  stats: ProductQuickStatData[]
}

const icons = {
  package: PackageX,
  cloud: CloudOff,
  alert: AlertTriangle,
  dollar: CircleDollarSign,
}

const colors = {
  rose: { color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-100' },
  amber: { color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-100' },
  indigo: { color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-100' },
  emerald: { color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-100' },
}

export function ProductQuickStats({ stats }: ProductQuickStatsProps) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((stat, i) => {
        const Icon = icons[stat.iconType] || PackageX
        const theme = colors[stat.colorTone]

        return (
          <Card key={i} className={cn("p-5 border shadow-sm rounded-2xl transition-all hover:shadow-md", theme.borderColor)}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-1">
                  <h4 className="text-2xl font-black tracking-tight text-slate-900">{stat.value}</h4>
                </div>
                <p className="text-[11px] font-bold text-slate-500 mt-2">{stat.description}</p>
              </div>
              <div className={cn("size-10 rounded-xl flex items-center justify-center", theme.bgColor)}>
                <Icon className={cn("size-5", theme.color)} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
