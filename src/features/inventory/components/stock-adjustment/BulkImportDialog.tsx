import { FileUp, Download, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface BulkImportDialogProps {
  isOpen: boolean
  onClose: () => void
  onImport: (data: any[]) => void
}

export function BulkImportDialog({ isOpen, onClose, onImport }: BulkImportDialogProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    // Giả lập upload file
    setTimeout(() => {
      setIsUploading(false)
      setIsSuccess(true)
      setTimeout(() => {
        onImport([]) // Trả về data giả lập
        onClose()
        setIsSuccess(false)
      }, 1500)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:rounded-[32px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-900">Nhập danh sách kiểm kê</DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 animate-bounce">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Tải lên thành công!</h3>
            <p className="text-sm text-slate-500">Dữ liệu đang được đồng bộ vào bảng kiểm kê.</p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div 
              className="group flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-slate-100 bg-slate-50/50 py-10 transition-all hover:border-primary-200 hover:bg-primary-50/30 cursor-pointer"
              onClick={handleUpload}
            >
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform group-hover:scale-110">
                <FileUp className="size-6 text-primary-500" />
              </div>
              <p className="text-sm font-bold text-slate-900">Kéo thả hoặc nhấn để tải lên</p>
              <p className="mt-1 text-xs text-slate-400">Hỗ trợ .XLSX, .CSV (Tối đa 5MB)</p>
            </div>

            <div className="rounded-2xl bg-slate-100/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-white text-slate-400">
                    <Download className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">File mẫu kiểm kê</p>
                    <p className="text-[10px] text-slate-400">Tải về để nhập đúng định dạng</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-primary-600 font-bold text-xs h-8">Tải xuống</Button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={onClose} className="rounded-xl font-bold">Hủy bỏ</Button>
              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                className="rounded-xl bg-slate-900 text-white font-bold px-6"
              >
                {isUploading ? "Đang xử lý..." : "Bắt đầu nhập dữ liệu"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
