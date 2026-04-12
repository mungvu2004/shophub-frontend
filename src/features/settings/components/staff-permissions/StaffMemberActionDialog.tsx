import { X } from 'lucide-react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type StaffMemberActionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberName: string
  actionLabel: string
}

export function StaffMemberActionDialog({ open, onOpenChange, memberName, actionLabel }: StaffMemberActionDialogProps) {
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
            <h2 className="font-heading text-[20px] font-bold leading-7 text-[#111c2d]">{actionLabel}</h2>

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
            <div className="rounded-[12px] bg-[#f8fafc] p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{memberName || 'Nhân viên đã chọn'}</p>
              <p className="pt-1 leading-6">
                Đây là panel thao tác nhanh. Mình đã đổi nó sang dạng drawer docked-right giống nút mời nhân viên để bạn bấm là nó trượt ra ngay.
              </p>
            </div>

            <div className="rounded-[12px] border border-slate-200 bg-white p-4 text-sm text-slate-600">
              Nếu bạn muốn, mình có thể tách riêng từng action thành form thật: sửa quyền, tạm dừng, hoặc kích hoạt lại.
            </div>

            <div className="pt-2">
              <Button
                type="button"
                size="lg"
                className="h-12 w-full rounded-[12px] bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-[16px] font-bold text-white shadow-[0px_20px_25px_-5px_rgba(99,102,241,0.2),0px_8px_10px_-6px_rgba(99,102,241,0.2)] hover:from-indigo-600 hover:via-indigo-600 hover:to-violet-500"
                onClick={() => onOpenChange(false)}
              >
                Đóng
              </Button>
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}