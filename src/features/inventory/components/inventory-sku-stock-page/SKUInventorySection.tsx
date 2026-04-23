import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SKUInventorySectionTone = 'default' | 'soft' | 'contrast'

export type SKUInventorySectionProps = {
  title: string
  description?: string
  rightSlot?: ReactNode
  children: ReactNode
  tone?: SKUInventorySectionTone
  className?: string
}

const toneClasses: Record<SKUInventorySectionTone, string> = {
  default: 'border-slate-200 bg-white',
  soft: 'border-slate-200 bg-white',
  contrast: 'border-slate-800 bg-slate-900 text-slate-50',
}

export function SKUInventorySection({
  title,
  description,
  rightSlot,
  children,
  tone = 'default',
  className,
}: SKUInventorySectionProps) {
  return (
    <section className={cn('rounded-3xl border p-4 sm:p-5', toneClasses[tone], className)}>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
        </div>
        {rightSlot}
      </header>
      {children}
    </section>
  )
}
