import { useState } from 'react'

import { CRUDModal } from '@/components/shared/CRUDModal'
import { MESSAGES } from '@/constants/messages'
import type { CRMCustomerCreatePayload, CRMCustomerProfileDetail, CRMCustomerSegmentKey } from '@/types/crm.types'

type FormMode = 'create' | 'edit'

type CRMCustomerFormModalProps = {
  open: boolean
  mode: FormMode
  customer?: CRMCustomerProfileDetail | null
  isProcessing?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: CRMCustomerCreatePayload) => Promise<void>
}

const SEGMENT_OPTIONS: Array<{ value: CRMCustomerSegmentKey; label: string }> = [
  { value: 'vip_gold', label: MESSAGES.CRM.CUSTOMER.STATUS.VIP_GOLD },
  { value: 'regular_blue', label: MESSAGES.CRM.CUSTOMER.STATUS.REGULAR_BLUE },
  { value: 'at_risk_red', label: MESSAGES.CRM.CUSTOMER.STATUS.AT_RISK_RED },
]

const PLATFORM_OPTIONS: Array<{ value: 'shopee' | 'lazada' | 'tiktok_shop'; label: string }> = [
  { value: 'shopee', label: 'Shopee' },
  { value: 'lazada', label: 'Lazada' },
  { value: 'tiktok_shop', label: 'TikTok Shop' },
]

const DEFAULT_FORM: CRMCustomerCreatePayload = {
  fullName: '',
  maskedPhone: '',
  email: '',
  segment: 'regular_blue',
  platformCodes: [],
}

export function CRMCustomerFormModal({
  open,
  mode,
  customer,
  isProcessing = false,
  onOpenChange,
  onSubmit,
}: CRMCustomerFormModalProps) {
  const [form, setForm] = useState<CRMCustomerCreatePayload>(() => {
    if (mode === 'edit' && customer) {
      return {
        fullName: customer.fullName,
        maskedPhone: customer.maskedPhone,
        email: customer.email,
        segment: (customer.segment.tone ?? 'regular_blue') as CRMCustomerSegmentKey,
        platformCodes: customer.platformLabels.map((p) => p.id),
      }
    }
    return DEFAULT_FORM
  })

  const title =
    mode === 'create'
      ? MESSAGES.CRM.CUSTOMER.FORM.CREATE_TITLE
      : MESSAGES.CRM.CUSTOMER.FORM.UPDATE_TITLE

  const submitLabel =
    mode === 'create'
      ? MESSAGES.CRM.CUSTOMER.FORM.CREATE_SUBMIT
      : MESSAGES.CRM.CUSTOMER.FORM.UPDATE_SUBMIT

  const processingLabel =
    mode === 'create'
      ? MESSAGES.CRM.CUSTOMER.BUTTON.ADD_LOADING
      : MESSAGES.CRM.CUSTOMER.BUTTON.EDIT_LOADING

  const handlePlatformToggle = (value: 'shopee' | 'lazada' | 'tiktok_shop') => {
    setForm((prev) => ({
      ...prev,
      platformCodes: prev.platformCodes.includes(value)
        ? prev.platformCodes.filter((p) => p !== value)
        : [...prev.platformCodes, value],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName.trim()) return
    await onSubmit(form)
  }

  return (
    <CRUDModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title={title}
      description="Chuẩn hóa biểu mẫu thêm và chỉnh sửa khách hàng theo luồng CRUD dùng chung."
      onSubmit={handleSubmit}
      isProcessing={isProcessing}
      processingText={processingLabel}
      submitText={submitLabel}
      cancelText="Hủy"
    >
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                placeholder="Nguyễn Văn A"
                value={form.fullName}
                onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                disabled={isProcessing}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Số điện thoại
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                placeholder="0912***456"
                value={form.maskedPhone}
                onChange={(e) => setForm((prev) => ({ ...prev, maskedPhone: e.target.value }))}
                disabled={isProcessing}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                placeholder="khachhang@email.com"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                disabled={isProcessing}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Phân khúc
              </label>
              <select
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                value={form.segment}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, segment: e.target.value as CRMCustomerSegmentKey }))
                }
                disabled={isProcessing}
              >
                {SEGMENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                Sàn thương mại
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATFORM_OPTIONS.map((opt) => {
                  const active = form.platformCodes.includes(opt.value)
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handlePlatformToggle(opt.value)}
                      disabled={isProcessing}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        active
                          ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>
    </CRUDModal>
  )
}
