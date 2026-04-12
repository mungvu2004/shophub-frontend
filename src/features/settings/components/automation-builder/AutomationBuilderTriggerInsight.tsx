import { CircleAlert } from 'lucide-react'

import type { AutomationBuilderPlatform } from '@/features/settings/logic/settingsAutomationBuilder.types'

const platformToneMap: Record<AutomationBuilderPlatform['code'], string> = {
  shopee: 'bg-orange-50 text-orange-700 border-orange-200',
  tiktok_shop: 'bg-slate-900 text-white border-slate-900',
  lazada: 'bg-blue-50 text-blue-700 border-blue-200',
}

type AutomationBuilderTriggerInsightProps = {
  triggerTitle: string
  triggerDescription: string
  platforms: AutomationBuilderPlatform[]
}

export function AutomationBuilderTriggerInsight({
  triggerTitle,
  triggerDescription,
  platforms,
}: AutomationBuilderTriggerInsightProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white px-6 py-6 shadow-[0_6px_16px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <CircleAlert className="size-5" />
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900">{triggerTitle} là gì?</h3>
          <p className="text-sm leading-6 text-slate-500">{triggerDescription}</p>

          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <span
                key={platform.code}
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${platformToneMap[platform.code]}`}
              >
                {platform.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
