import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { MESSAGES } from '@/constants/messages'
import type { OrderStatus } from '@/types/order.types'
import type { PlatformCode } from '@/types/platform.types'

export type PendingActionFormMode = 'create' | 'edit'

export type PendingActionFormValues = {
  orderCode: string
  customerName: string
  productName: string
  amount: string
  platform: PlatformCode
  status: OrderStatus
}

type OrdersPendingActionsFormDialogProps = {
  open: boolean
  mode: PendingActionFormMode
  isSubmitting: boolean
  values: PendingActionFormValues
  onValuesChange: (values: PendingActionFormValues) => void
  onOpenChange: (open: boolean) => void
  onSubmit: (values: PendingActionFormValues) => Promise<void>
}

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string }> = [
  { value: 'Pending', label: 'Chờ xử lý' },
  { value: 'PendingPayment', label: 'Chờ thanh toán' },
  { value: 'Confirmed', label: 'Đã xác nhận' },
  { value: 'Packed', label: 'Đã đóng gói' },
  { value: 'ReadyToShip', label: 'Sẵn sàng giao' },
  { value: 'Shipped', label: 'Đang vận chuyển' },
]

const PLATFORM_OPTIONS: Array<{ value: PlatformCode; label: string }> = [
  { value: 'shopee', label: 'Shopee' },
  { value: 'lazada', label: 'Lazada' },
  { value: 'tiktok_shop', label: 'TikTok Shop' },
]

export function OrdersPendingActionsFormDialog({
  open,
  mode,
  isSubmitting,
  values,
  onValuesChange,
  onOpenChange,
  onSubmit,
}: OrdersPendingActionsFormDialogProps) {
  const modalTitle = mode === 'create'
    ? MESSAGES.ORDERS.PENDING_ACTIONS.FORM.CREATE_TITLE
    : MESSAGES.ORDERS.PENDING_ACTIONS.FORM.UPDATE_TITLE

  const submitText = mode === 'create'
    ? MESSAGES.ORDERS.PENDING_ACTIONS.FORM.CREATE_SUBMIT
    : MESSAGES.ORDERS.PENDING_ACTIONS.FORM.UPDATE_SUBMIT

  const loadingText = mode === 'create' ? 'Đang thêm...' : 'Đang lưu...'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>Biểu mẫu dùng chung cho thao tác thêm và chỉnh sửa đơn chờ xử lý.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mã đơn</span>
            <Input
              value={values.orderCode}
              onChange={(event) => onValuesChange({ ...values, orderCode: event.currentTarget.value })}
              placeholder="SO-1001"
              disabled={isSubmitting}
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Khách hàng</span>
            <Input
              value={values.customerName}
              onChange={(event) => onValuesChange({ ...values, customerName: event.currentTarget.value })}
              placeholder="Nguyễn Văn A"
              disabled={isSubmitting}
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sản phẩm</span>
            <Input
              value={values.productName}
              onChange={(event) => onValuesChange({ ...values, productName: event.currentTarget.value })}
              placeholder="Tên sản phẩm"
              disabled={isSubmitting}
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Giá trị đơn (VND)</span>
            <Input
              type="number"
              min={0}
              value={values.amount}
              onChange={(event) => onValuesChange({ ...values, amount: event.currentTarget.value })}
              placeholder="150000"
              disabled={isSubmitting}
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sàn</span>
            <select
              value={values.platform}
              onChange={(event) => onValuesChange({ ...values, platform: event.currentTarget.value as PlatformCode })}
              className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
              disabled={isSubmitting}
            >
              {PLATFORM_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Trạng thái</span>
            <select
              value={values.status}
              onChange={(event) => onValuesChange({ ...values, status: event.currentTarget.value as OrderStatus })}
              className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
              disabled={isSubmitting}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        <DialogFooter className="mt-2 flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            onClick={() => onSubmit(values)}
            isLoading={isSubmitting}
            loadingText={loadingText}
          >
            {submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
