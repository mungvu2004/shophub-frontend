import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { formatDateLabel } from '@/components/layout/navbar/navbarDate.utils'

type NavbarTitleSectionProps = {
  pageTitle: string
  selectedDate: string
  toggleSidebar: () => void
}

export function NavbarTitleSection({ pageTitle, selectedDate, toggleSidebar }: NavbarTitleSectionProps) {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="size-5" />
      </Button>

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-3">
          <h2 className="truncate text-xl font-bold tracking-tight text-slate-900">{pageTitle}</h2>
          <span className="hidden h-4 w-px bg-slate-300 sm:block" />
          <span className="hidden items-center gap-2 text-sm text-slate-500 sm:inline-flex">
            <span className="relative inline-flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/50" />
              <span className="relative size-2 rounded-full bg-emerald-500" />
            </span>
            {formatDateLabel(selectedDate)}
          </span>
        </div>
      </div>
    </div>
  )
}
