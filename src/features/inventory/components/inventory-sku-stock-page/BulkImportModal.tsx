import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, FileText, CheckCircle2, AlertCircle, X, Download } from 'lucide-react'
import { useRef } from 'react'
import type { useBulkImport } from '@/features/inventory/hooks/useBulkImport'
import type { BulkImportRow } from '@/features/inventory/logic/bulkImport.types'

export type BulkImportModalProps = {
  model: ReturnType<typeof useBulkImport>
}

export function BulkImportModal({ model }: BulkImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const {
    isOpen,
    isProcessing,
    importResult,
    file,
    closeModal,
    handleFileUpload,
    handleConfirmImport
  } = model

  const handleDownloadTemplate = () => {
    const csvContent = 'sku,productName,warehouseHN,warehouseHCM,warehouseDN,reason,note\nSKU001,Sản phẩm A,10,20,5,Cập nhật định kỳ,Kho chính\nSKU002,Sản phẩm B,5,15,0,Nhập kho mới,'
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'shopub_inventory_template.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-3xl overflow-hidden rounded-3xl border-slate-200 bg-white p-0 shadow-2xl">
        <div className="relative isolate px-6 py-8 sm:px-10">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.08),_transparent_40%)]" />
          
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black text-slate-900">Nhập tồn kho hàng loạt</DialogTitle>
                <DialogDescription className="mt-1 text-sm text-slate-500">
                  Cập nhật tồn kho nhanh chóng qua tệp CSV cho nhiều kho HN, HCM và ĐN.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-8 space-y-6">
            {!file ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 py-12 px-6 text-center transition-all hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden" 
                  accept=".csv"
                />
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="h-8 w-8 text-indigo-500" />
                </div>
                <div className="mt-6">
                  <p className="text-lg font-bold text-slate-900">Kéo thả hoặc nhấn để tải lên</p>
                  <p className="mt-1 text-sm text-slate-500">Chấp nhận tệp CSV lên đến 10MB</p>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownloadTemplate()
                  }}
                  className="mt-6 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Tải mẫu CSV
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  {!isProcessing && (
                    <button 
                      onClick={() => handleFileUpload(null as unknown as File)} // Reset file
                      className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-8 space-y-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    <p className="text-sm font-medium text-slate-600">Đang kiểm tra dữ liệu...</p>
                  </div>
                ) : importResult && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                        <div className="flex items-center gap-2 text-emerald-700">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="text-sm font-bold">Hợp lệ</span>
                        </div>
                        <p className="mt-2 text-2xl font-black text-emerald-800">{importResult.successCount} SKU</p>
                      </div>
                      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
                        <div className="flex items-center gap-2 text-red-700">
                          <AlertCircle className="h-5 w-5" />
                          <span className="text-sm font-bold">Lỗi dữ liệu</span>
                        </div>
                        <p className="mt-2 text-2xl font-black text-red-800">{importResult.errorCount} SKU</p>
                      </div>
                    </div>

                    {importResult.errors.length > 0 && (
                      <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Danh sách lỗi chi tiết</p>
                        <ul className="space-y-2">
                          {importResult.errors.slice(0, 10).map((error, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-red-600">
                              <span className="mt-0.5 shrink-0 rounded bg-red-100 px-1 text-[10px] font-bold">Dòng {error.row}</span>
                              <span>{error.message}</span>
                            </li>
                          ))}
                          {importResult.errors.length > 10 && (
                            <li className="text-xs text-slate-500 italic pl-2">Và {importResult.errors.length - 10} lỗi khác...</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="mt-10 gap-3 sm:justify-end">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={closeModal}
              disabled={isProcessing}
              className="rounded-full font-bold text-slate-600"
            >
              Hủy bỏ
            </Button>
            <Button 
              type="button" 
              onClick={handleConfirmImport}
              disabled={isProcessing || !file || (importResult?.errorCount ?? 0) > 0}
              className="rounded-full bg-indigo-600 px-8 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isProcessing ? 'Đang xử lý...' : 'Xác nhận nhập kho'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
