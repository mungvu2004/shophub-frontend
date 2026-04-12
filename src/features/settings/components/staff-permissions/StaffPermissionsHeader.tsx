import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

type StaffPermissionsHeaderProps = {
  title: string
  subtitle: string
  actionLabel: string
  onActionClick: () => void
}

export function StaffPermissionsHeader({ title, subtitle, actionLabel, onActionClick }: StaffPermissionsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-white/70 bg-white/80 px-6 py-6 shadow-[0px_10px_30px_rgba(15,23,42,0.04)] backdrop-blur sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <h1 className="font-heading text-[clamp(1.6rem,2vw,2.2rem)] font-semibold tracking-[-0.04em] text-slate-900">
          {title}
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">{subtitle}</p>
      </div>

      <Button
        type="button"
        size="lg"
        onClick={onActionClick}
        className="min-w-[210px] bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white shadow-[0px_12px_20px_rgba(79,70,229,0.22)] hover:from-indigo-600 hover:via-indigo-600 hover:to-violet-500"
      >
        <Plus className="size-4" />
        <span>{actionLabel}</span>
      </Button>
    </div>
  )
}