import { X, FileText, User, Clock, MapPin, Hash, Package, ExternalLink, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { InventoryStockMovementRecord } from '@/features/inventory/logic/inventoryStockMovements.types'
import { Button } from '@/components/ui/button'

type InventoryStockMovementDetailDrawerProps = {
  movement: InventoryStockMovementRecord | null
  isOpen: boolean
  onClose: () => void
}

export function InventoryStockMovementDetailDrawer({ movement, isOpen, onClose }: InventoryStockMovementDetailDrawerProps) {
  if (!movement) return null

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      <div className={cn(
        "fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl transition-transform duration-500 ease-out sm:rounded-l-[40px]",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 p-6 md:px-8">
            <div>
              <h2 className="text-xl font-black text-slate-900">Chi tiết biến động</h2>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">ID: #{movement.id}</p>
            </div>
            <button 
              onClick={onClose}
              className="group flex size-10 items-center justify-center rounded-2xl bg-slate-50 transition-all hover:bg-rose-50"
            >
              <X className="size-5 text-slate-400 transition-colors group-hover:text-rose-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar md:px-8">
            {movement.isAnomaly && (
              <div className="mb-8 flex items-start gap-4 rounded-[24px] border border-rose-100 bg-rose-50/50 p-5 text-rose-800">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-rose-100">
                  <AlertTriangle className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-wide">Cảnh báo bất thường</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed opacity-80">
                    Phát hiện biến động với số lượng lớn bất thường so với mức trung bình. Vui lòng kiểm tra lại chứng từ và xác nhận từ quản lý.
                  </p>
                </div>
              </div>
            )}

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="size-16 shrink-0 overflow-hidden rounded-[24px] bg-slate-100 border border-slate-100">
                  {movement.imageUrl ? <img src={movement.imageUrl} className="h-full w-full object-cover" /> : <Package className="m-auto size-6 text-slate-300" />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{movement.productName}</h3>
                  <p className="text-xs font-mono text-slate-500">{movement.sku}</p>
                  {movement.variantName && <p className="mt-0.5 text-xs font-medium text-slate-400">{movement.variantName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Số lượng thay đổi</p>
                  <p className={cn(
                    "mt-1 text-2xl font-black",
                    movement.delta > 0 ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {movement.deltaLabel}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tồn sau điều chỉnh</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">{movement.qtyAfter}</p>
                </div>
              </div>

              <div className="space-y-4 rounded-[32px] border border-slate-100 p-6">
                <div className="flex items-center gap-3">
                  <User className="size-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Người thực hiện (Audit Trail)</p>
                    <p className="mt-1 text-sm font-bold text-slate-700">{movement.performerName || movement.createdByLabel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="size-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Thời gian hệ thống</p>
                    <p className="mt-1 text-sm font-bold text-slate-700">{movement.createdAtLabel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="size-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Kho vật lý</p>
                    <p className="mt-1 text-sm font-bold text-slate-700">{movement.warehouseName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Hash className="size-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Mã tham chiếu</p>
                    <p className="mt-1 text-sm font-mono font-bold text-indigo-600">{movement.refOrderItemId || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Ghi chú & Lý do</h4>
                <div className="rounded-3xl bg-indigo-50/50 p-5 text-sm font-medium leading-relaxed text-slate-700 border border-indigo-50">
                  {movement.reason ? <p className="font-bold text-indigo-900 mb-1">{movement.reason}</p> : null}
                  {movement.note || 'Không có ghi chú thêm.'}
                </div>
              </div>

              <div className="space-y-3 pb-8">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Chứng từ đính kèm</h4>
                  <span className="text-[10px] font-bold text-slate-400">Max 5 files</span>
                </div>

                {movement.attachments && movement.attachments.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {movement.attachments.map((url, idx) => (
                      <a 
                        key={idx} 
                        href={url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 transition-all hover:border-indigo-200 hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                            <FileText className="size-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">Chung_tu_kho_{idx + 1}.pdf</p>
                            <p className="text-[10px] font-medium text-slate-400">1.2 MB · PDF</p>
                          </div>
                        </div>
                        <ExternalLink className="size-3 text-slate-300 group-hover:text-indigo-600" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border-2 border-dashed border-slate-100 py-8 text-center">
                    <p className="text-xs font-bold text-slate-400">Không có chứng từ đính kèm</p>
                    <Button variant="ghost" size="sm" className="mt-2 text-indigo-600 font-bold h-7 text-[10px] uppercase tracking-wider">Tải lên ngay</Button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}
