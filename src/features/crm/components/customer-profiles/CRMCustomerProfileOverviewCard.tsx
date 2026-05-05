import { Loader2, PencilLine, Sparkles, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MESSAGES } from '@/constants/messages'

type CRMCustomerProfileOverviewCardProps = {
  selectedCustomer: {
    id?: string
    avatarUrl: string
    fullName: string
    maskedPhone: string
    email: string
    customerSinceLabel: string
    segmentBadge: { label: string; className: string }
    platformBadges: Array<{ id: string; label: string; className: string }>
    primaryCtaLabel: string
    secondaryCtaLabel: string
  } | null
  isProcessing?: boolean
  actionType?: 'creating' | 'updating' | 'deleting' | 'status-changing' | null
  onEdit?: () => void
  onDelete?: () => void
  onChangeStatus?: () => void
}

export function CRMCustomerProfileOverviewCard({
  selectedCustomer,
  isProcessing = false,
  actionType,
  onEdit,
  onDelete,
  onChangeStatus,
}: CRMCustomerProfileOverviewCardProps) {
  if (!selectedCustomer) {
    return <div className="rounded-[12px] border border-slate-200 bg-white p-8 text-sm text-slate-500">Chưa có khách hàng nào được chọn.</div>
  }

  const isDeleting = isProcessing && actionType === 'deleting'
  const isEditing = isProcessing && actionType === 'updating'
  const isChangingStatus = isProcessing && actionType === 'status-changing'

  return (
    <section className="overflow-hidden rounded-[12px] bg-white shadow-[0px_12px_32px_0px_rgba(15,23,42,0.06)]">
      <div className="h-2 w-full bg-gradient-to-r from-[#3525cd] to-[#4f46e5]" />

      <div className="p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex gap-6">
            <div className="relative shrink-0">
              <img src={selectedCustomer.avatarUrl} alt={selectedCustomer.fullName} className="size-20 rounded-2xl object-cover shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)]" />
              <div className="absolute -bottom-2 -right-2 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-bold text-white shadow-[0px_0px_0px_2px_white]">
                VIP
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="max-w-[260px] text-[24px] font-bold leading-[1.25] tracking-[-0.03em] text-slate-900">
                  {selectedCustomer.fullName}
                </h2>
                <span className={cn('inline-flex rounded-[6px] border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em]', selectedCustomer.segmentBadge.className)}>
                  {selectedCustomer.segmentBadge.label}
                </span>
              </div>

              <div className="space-y-1 text-sm text-slate-500">
                <div>{selectedCustomer.maskedPhone}</div>
                <div>{selectedCustomer.email}</div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="text-xs text-slate-500">
                  Khách hàng từ: <span className="font-semibold text-slate-900">{selectedCustomer.customerSinceLabel}</span>
                </div>
                {selectedCustomer.platformBadges.map((badge) => (
                  <span key={badge.id} className={cn('inline-flex items-center gap-1 rounded-[4px] px-2 py-1 text-[10px] font-bold', badge.className)}>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" className="h-9 rounded-lg border-[#3525cd] px-4 text-[#3525cd]" disabled={isProcessing}>
              <Sparkles className="size-4" />
              {selectedCustomer.primaryCtaLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-lg px-4 text-slate-900"
              disabled={isProcessing}
              onClick={onEdit}
            >
              {isEditing ? <Loader2 className="size-4 animate-spin" /> : <PencilLine className="size-4" />}
              {isEditing ? MESSAGES.CRM.CUSTOMER.BUTTON.EDIT_LOADING : MESSAGES.CRM.CUSTOMER.BUTTON.EDIT}
            </Button>
            {onChangeStatus && (
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-lg border-amber-200 px-4 text-amber-700 hover:bg-amber-50"
                disabled={isProcessing}
                onClick={onChangeStatus}
              >
                {isChangingStatus ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {isChangingStatus ? MESSAGES.CRM.CUSTOMER.BUTTON.STATUS_LOADING : MESSAGES.CRM.CUSTOMER.BUTTON.STATUS}
              </Button>
            )}
            {onDelete && (
              <Button
                type="button"
                variant="outline"
                className="h-9 rounded-lg border-red-200 px-4 text-red-600 hover:bg-red-50"
                disabled={isProcessing}
                onClick={onDelete}
              >
                {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                {isDeleting ? MESSAGES.CRM.CUSTOMER.BUTTON.DELETE_LOADING : MESSAGES.CRM.CUSTOMER.BUTTON.DELETE}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
