import { CalendarDays, Shield, TrendingDown } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import type { DynamicPricingRule } from '@/features/products/logic/productsDynamicPricing.types'
import { platformLabelMap } from '@/features/products/components/products-dynamic-pricing/dynamicPricing.formatters'

type DynamicPricingRuleCardProps = {
  rule: DynamicPricingRule
  onToggle: (nextActive: boolean) => void
  disabled?: boolean
}

const iconMap = {
  trend: TrendingDown,
  shield: Shield,
  calendar: CalendarDays,
} as const

export function DynamicPricingRuleCard({ rule, onToggle, disabled = false }: DynamicPricingRuleCardProps) {
  const RuleIcon = iconMap[rule.icon]
  const isActive = rule.status === 'active'

  return (
    <article
      className={[
        'rounded-xl border p-5 shadow-sm',
        isActive ? 'border-slate-200 bg-white' : 'border-dashed border-slate-300 bg-slate-50/80 opacity-75',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={[
            'flex h-10 w-10 items-center justify-center rounded-lg',
            isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500',
          ].join(' ')}>
            <RuleIcon className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{rule.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{rule.description}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggle(!isActive)}
          aria-pressed={isActive}
          aria-label={`Chuyển trạng thái quy tắc ${rule.title}`}
          disabled={disabled}
          className={[
            'flex h-6 w-10 items-center rounded-full px-1 transition-colors',
            isActive ? 'justify-end bg-emerald-500' : 'justify-start bg-slate-300',
            disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
          ].join(' ')}
        >
          <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">Áp dụng: {rule.appliedProducts} sản phẩm</p>
        <div className="flex flex-wrap items-center gap-1">
          {rule.platforms.map((platform) => (
            <Badge key={`${rule.id}-${platform}`} variant="outline" className="text-[10px]">
              {platformLabelMap[platform]}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide">
          <span className="text-slate-400">Trạng thái</span>
          <span className={isActive ? 'text-emerald-600' : 'text-slate-400'}>
            {isActive ? 'Hoạt động' : 'Tạm dừng'}
          </span>
        </div>

        {rule.tag ? (
          <Badge className="mt-2 bg-indigo-100 text-[10px] text-indigo-700 hover:bg-indigo-100">{rule.tag}</Badge>
        ) : null}

        {rule.scheduleText ? (
          <p className="mt-2 text-xs font-medium text-slate-500">{rule.scheduleText}</p>
        ) : null}
      </div>
    </article>
  )
}
