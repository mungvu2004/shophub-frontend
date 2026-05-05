import { useState } from 'react'
import { FileDown, Plus, Save, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ApprovalBanner } from './ApprovalBanner'
import { StockAdjustmentTable } from './StockAdjustmentTable'
import { BulkImportDialog } from './BulkImportDialog'
import { useStockAdjustment } from '@/features/inventory/hooks/useStockAdjustment'
import { mockAdjustments } from '@/mocks/data/inventoryAdjustments'
import { useProductData } from '@/features/products/hooks/useProductData'

export function StockAdjustmentView() {
  // Centralized product data from store
  useProductData({
    autoPreload: false,
    pageName: 'InventoryStockAdjustmentPage',
  })

  const [isImportOpen, setIsImportOpen] = useState(false)
  const { 
    viewModel, 
    updateItemQty, 
    submitAdjustment, 
    approveAdjustment, 
    rejectAdjustment,
    isSubmitting 
  } = useStockAdjustment(mockAdjustments[0])

  const { adjustment, canApprove, canEdit, summary } = viewModel

  return (
    <div className="space-y-6 pb-12 pt-1">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900">Phiếu kiểm kê & Điều chỉnh</h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              #{adjustment.code}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Khởi tạo bởi <span className="font-bold text-slate-700">{adjustment.requestedBy}</span> vào {adjustment.requestedAt}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-slate-600">
            <FileDown className="mr-2 size-4" /> Xuất báo cáo
          </Button>
          <Button 
            onClick={() => setIsImportOpen(true)}
            className="rounded-xl border-slate-200 bg-white font-bold text-slate-900 shadow-sm border hover:bg-slate-50"
          >
            <Plus className="mr-2 size-4" /> Import Excel
          </Button>
        </div>
      </header>

      <ApprovalBanner 
        adjustment={adjustment}
        canApprove={canApprove}
        onApprove={approveAdjustment}
        onReject={rejectAdjustment}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          <StockAdjustmentTable 
            items={adjustment.items} 
            onItemChange={updateItemQty}
            isEditable={canEdit}
          />

          <div className="flex items-center justify-end gap-3">
             <Button variant="ghost" className="rounded-xl font-bold text-slate-500">Hủy bỏ</Button>
             <Button 
               variant="outline" 
               className="rounded-xl border-slate-200 font-bold"
               disabled={isSubmitting || !canEdit}
             >
               <Save className="mr-2 size-4" /> Lưu bản nháp
             </Button>
             <Button 
               className="rounded-xl bg-slate-900 px-8 font-bold text-white hover:bg-slate-800"
               onClick={submitAdjustment}
               disabled={isSubmitting || !canEdit}
             >
               {isSubmitting ? "Đang xử lý..." : (
                 <>
                   <Send className="mr-2 size-4" /> 
                   {adjustment.requiresApproval ? "Gửi duyệt" : "Xác nhận điều chỉnh"}
                 </>
               )}
             </Button>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Tóm tắt biến động</h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Tổng số SKU</span>
                <span className="font-mono font-bold text-slate-900">{summary.totalItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Tăng tồn</span>
                <span className="font-mono font-bold text-emerald-600">+{summary.increasedItems}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Giảm tồn</span>
                <span className="font-mono font-bold text-rose-600">-{Math.abs(summary.decreasedItems)}</span>
              </div>
              <div className="border-t border-slate-50 pt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Tổng chênh lệch</span>
                <span className={`font-mono font-black text-lg ${adjustment.totalDifference >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {adjustment.totalDifference > 0 ? `+${adjustment.totalDifference}` : adjustment.totalDifference}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] bg-primary-900 p-6 text-white shadow-xl">
             <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60">Ghi chú nghiệp vụ</h3>
             <p className="mt-3 text-sm font-medium leading-relaxed opacity-90">
                Mọi điều chỉnh trên {Math.abs(adjustment.totalDifference)} đơn vị sẽ kích hoạt quy trình phê duyệt 2 cấp tự động. Vui lòng đính kèm biên bản kiểm kê nếu cần thiết.
             </p>
          </section>
        </div>
      </div>

      <BulkImportDialog 
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={(data) => {
          console.log('Imported data:', data)
          // Xử lý dữ liệu import ở đây
        }}
      />
    </div>
  )
}
