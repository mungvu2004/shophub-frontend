import { useState } from 'react'
import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import type { SettingsStaffPermissionsInviteViewModel } from '@/features/settings/logic/settingsStaffPermissionsInvite.types'

import { InvitePermissionToggle } from '@/features/settings/components/staff-permissions/InvitePermissionToggle'

type SettingsStaffPermissionsInviteDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  model: SettingsStaffPermissionsInviteViewModel | null
}

export function SettingsStaffPermissionsInviteDrawer({ open, onOpenChange, model }: SettingsStaffPermissionsInviteDrawerProps) {
  const defaultRoleId = model?.defaultRoleOptions[0]?.id ?? ''

  const [email, setEmail] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState(defaultRoleId)
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([])

  const [prevOpen, setPrevOpen] = useState(open)
  const [prevModel, setPrevModel] = useState(model)

  if (open !== prevOpen || model !== prevModel) {
    setPrevOpen(open)
    setPrevModel(model)
    if (open && model) {
      setSelectedRoleId(model.defaultRoleOptions[0]?.id ?? '')
      setSelectedPermissionIds(model.permissions.filter((permission) => permission.defaultChecked).map((permission) => permission.id))
      setEmail('')
    }
  }

  if (!model) {
    return null
  }

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((current) =>
      current.includes(permissionId) ? current.filter((item) => item !== permissionId) : [...current, permissionId],
    )
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-[rgba(15,23,42,0.4)] backdrop-blur-[2px]" />

        <DialogPrimitive.Popup
          className={cn(
            'fixed right-0 top-0 z-50 flex h-full w-[380px] max-w-none translate-x-0 translate-y-0 flex-col bg-white p-8 text-sm text-slate-900 outline-none',
            'shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]',
          )}
        >
          <div className="flex items-start justify-between gap-4 pb-8">
            <h2 className="font-heading text-[20px] font-bold leading-7 text-[#111c2d]">{model.title}</h2>

            <DialogPrimitive.Close
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="size-8 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                />
              }
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-6 pb-4">
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">{model.emailLabel}</p>
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={model.emailPlaceholder}
                className="h-11 border-0 bg-[#f0f3ff] px-3.5 text-[14px] text-slate-900 placeholder:text-slate-500 focus-visible:ring-0"
              />
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">{model.defaultRoleLabel}</p>
              <div className="relative">
                <select
                  value={selectedRoleId}
                  onChange={(event) => setSelectedRoleId(event.target.value)}
                  className="h-11 w-full appearance-none rounded-[8px] border-0 bg-[#f0f3ff] px-3.5 pr-10 text-[14px] text-slate-900 outline-none ring-0 transition focus-visible:ring-0"
                >
                  {model.defaultRoleOptions.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                  <svg viewBox="0 0 20 20" className="size-4" fill="none" aria-hidden>
                    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">{model.permissionsLabel}</p>
              <div className="space-y-3">
                {model.permissions.map((permission) => (
                  <InvitePermissionToggle
                    key={permission.id}
                    label={permission.label}
                    checked={selectedPermissionIds.includes(permission.id)}
                    onToggle={() => togglePermission(permission.id)}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="button"
                size="lg"
                className="h-12 w-full rounded-[12px] bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-[16px] font-bold text-white shadow-[0px_20px_25px_-5px_rgba(99,102,241,0.2),0px_8px_10px_-6px_rgba(99,102,241,0.2)] hover:from-indigo-600 hover:via-indigo-600 hover:to-violet-500"
              >
                {model.submitLabel}
              </Button>

              <p className="px-4 pt-4 text-center text-[10px] leading-[15px] text-slate-400">{model.helperText}</p>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}