import { CirclePlus } from 'lucide-react'

import { DynamicPricingRuleCard } from '@/features/products/components/products-dynamic-pricing/DynamicPricingRuleCard'
import type { DynamicPricingRule } from '@/features/products/logic/productsDynamicPricing.types'

type DynamicPricingRulesSectionProps = {
  rules: DynamicPricingRule[]
  onToggleRule: (ruleId: string, nextActive: boolean) => void
  isTogglingRule: boolean
}

export function DynamicPricingRulesSection({
  rules,
  onToggleRule,
  isTogglingRule,
}: DynamicPricingRulesSectionProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Quy tắc định giá đang áp dụng</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <CirclePlus className="h-4 w-4" aria-hidden />
          Thêm quy tắc mới
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {rules.map((rule) => (
          <DynamicPricingRuleCard
            key={rule.id}
            rule={rule}
            onToggle={(nextActive) => onToggleRule(rule.id, nextActive)}
            disabled={isTogglingRule}
          />
        ))}
      </div>
    </section>
  )
}
