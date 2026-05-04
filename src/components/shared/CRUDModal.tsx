import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type CRUDModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing?: boolean;
  processingText?: string;
  submitText?: string;
  cancelText?: string;
  submitIcon?: ReactNode;
};

export function CRUDModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSubmit,
  isProcessing = false,
  processingText = 'Đang xử lý...',
  submitText = 'Lưu',
  cancelText = 'Hủy',
  submitIcon,
}: CRUDModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open && !isProcessing) onClose(); }}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription className="mt-1.5">{description}</DialogDescription>}
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {children}
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
            >
              {cancelText}
            </Button>
            <Button
              type="submit"
              disabled={isProcessing}
              className="min-w-[100px]"
            >
              {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!isProcessing && submitIcon && <span className="mr-2">{submitIcon}</span>}
              {isProcessing ? processingText : submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
