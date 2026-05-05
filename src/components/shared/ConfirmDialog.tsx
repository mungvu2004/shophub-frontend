import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  isConfirming?: boolean
  variant?: 'danger' | 'primary' | 'default'
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onConfirm,
  onCancel,
  isConfirming = false,
  variant = 'danger',
}: ConfirmDialogProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
    onOpenChange(false)
  }

  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={!isConfirming}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex flex-row items-center justify-end gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isConfirming}>
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            isLoading={isConfirming}
            loadingText="Đang xử lý..."
          >
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
