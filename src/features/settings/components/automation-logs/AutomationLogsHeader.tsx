import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

type AutomationLogsHeaderProps = {
  title: string
  onClose: () => void
}

export function AutomationLogsHeader({ title, onClose }: AutomationLogsHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
      <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
      <Button type="button" variant="ghost" size="xs" onClick={onClose} className="gap-1 text-slate-500">
        <X className="size-3.5" />
        Đóng
      </Button>
    </header>
  )
}
