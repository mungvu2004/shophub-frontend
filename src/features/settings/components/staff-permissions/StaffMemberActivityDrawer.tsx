import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { SettingsStaffPermissionsActivityViewModel } from '@/features/settings/logic/settingsStaffPermissionsActivity.types'

type StaffMemberActivityDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  model: SettingsStaffPermissionsActivityViewModel | null
  isLoading: boolean
}

function iconByKind(kind: 'inventory' | 'order' | 'export') {
  if (kind === 'order') return '✓'
  if (kind === 'export') return '📤'
  return '📦'
}

export function StaffMemberActivityDrawer({ open, onOpenChange, model, isLoading }: StaffMemberActivityDrawerProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-[rgba(15,23,42,0.4)] backdrop-blur-[2px]" />

        <DialogPrimitive.Popup
          className={cn(
            'fixed right-0 top-0 z-50 flex h-full w-[480px] max-w-none translate-x-0 translate-y-0 flex-col border-l border-slate-100 bg-white text-sm text-slate-900 outline-none',
            'shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]',
          )}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <h2 className="font-heading text-[16px] font-semibold leading-6 text-slate-900">{model?.headerTitle ?? 'Hoạt động'}</h2>
            <DialogPrimitive.Close
              render={
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 rounded-[12px] px-3 text-[14px] text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                />
              }
            >
              <X className="mr-1 size-3.5" />
              <span>Đóng</span>
            </DialogPrimitive.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
            {isLoading && !model ? <p className="text-sm text-slate-500">Đang tải hoạt động...</p> : null}

            {!isLoading && model ? (
              <div className="relative space-y-6">
                <div className="absolute bottom-6 left-[17px] top-2 w-px bg-slate-100" />

                {model.sections.map((section) => (
                  <div key={section.id} className="space-y-4">
                    {section.label ? (
                      <div className="rounded-[12px] bg-[rgba(248,250,252,0.5)] py-4 text-center text-[11px] font-medium uppercase tracking-[0.1em] text-slate-400">
                        {section.label}
                      </div>
                    ) : null}

                    {section.entries.map((entry) => (
                      <div key={entry.id} className={cn('relative pl-10', entry.dimmed ? 'opacity-50' : '')}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-[14px] font-medium leading-5 text-slate-900">{entry.title}</p>
                            {entry.detail ? <p className="text-xs leading-4 text-slate-500">{entry.detail}</p> : null}
                          </div>
                          <span className="rounded-[8px] bg-slate-50 px-1.5 py-0.5 font-mono text-xs text-slate-400">{entry.timeLabel}</span>
                        </div>

                        <span
                          className={cn(
                            'absolute left-0 top-1.5 flex size-9 items-center justify-center rounded-full text-[16px]',
                            entry.kind === 'order' ? 'bg-[#f1f5f9]' : 'bg-[#eff6ff]',
                          )}
                        >
                          {iconByKind(entry.kind)}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="border-t border-slate-100 bg-[rgba(248,250,252,0.5)] px-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">{model?.summaryLabel ?? 'Hiển thị 1-20 trong 0 hoạt động'}</p>
              <div className="flex items-center gap-2">
                <button type="button" className="rounded-[8px] border border-slate-200 px-2 py-1 text-slate-300" aria-label="Previous page">
                  ‹
                </button>
                <button type="button" className="rounded-[8px] border border-slate-200 px-2 py-1 text-slate-400 shadow-sm" aria-label="Next page">
                  ›
                </button>
              </div>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}