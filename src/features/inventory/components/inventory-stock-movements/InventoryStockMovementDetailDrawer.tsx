import { X, FileText, User, Clock, MapPin, Hash, Package, ExternalLink, AlertTriangle, Upload, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { InventoryStockMovementRecord } from '@/features/inventory/logic/inventoryStockMovements.types'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useState } from 'react'

type InventoryStockMovementDetailDrawerProps = {
  movement: InventoryStockMovementRecord | null
  isOpen: boolean
  onClose: () => void
}

export function InventoryStockMovementDetailDrawer({ movement, isOpen, onClose }: InventoryStockMovementDetailDrawerProps) {
  const [isVerified, setIsVerified] = useState(false)
  if (!movement) return null

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] sm:rounded-l-[40px]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        aria-describedby="drawer-description"
      >
        <div className={cn(
          "flex h-full flex-col transition-all duration-500 delay-150",
          isOpen ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-95 translate-x-10"
        )}>
          <div className="flex items-center justify-between border-b border-slate-100 p-6 md:px-8">
            <div>
              <div className="flex items-center gap-2">
                <h2 id="drawer-title" className="text-xl font-black text-slate-900">Chi tiết biến động</h2>
                {isVerified ? (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100">
                    <CheckCircle2 className="size-2.5" />
                    Đã Audit
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-amber-600 border border-amber-100 animate-pulse">
                    Chờ xác nhận
                  </span>
                )}
              </div>
              <p id="drawer-description" className="text-xs font-bold uppercase tracking-widest text-slate-400">ID: #{movement.id}</p>
            </div>
            <button 
              onClick={onClose}
              aria-label="Đóng chi tiết"
              className="group flex size-10 items-center justify-center rounded-2xl bg-slate-50 transition-all hover:bg-rose-50"
            >
              <X className="size-5 text-slate-400 transition-colors group-hover:text-rose-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar md:px-8">
            {movement.isAnomaly && (
              <div className="mb-8 flex items-start gap-4 rounded-[24px] border border-amber-100 bg-amber-50/50 p-5 text-amber-900">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
                  <AlertTriangle className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-wide">Cảnh báo bất thường</p>
                  <p className="mt-1 text-sm font-medium leading-relaxed opacity-80">
                    Phát hiện biến động với số lượng lớn bất thường (vượt 200%) so với mức trung bình 30 ngày của SKU này. Vui lòng kiểm tra lại chứng từ đính kèm và xác nhận từ quản lý kho.
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">Người thực hiện (Audit Trail)</p>
                    <p className="mt-1 text-sm font-bold text-secondary-900">{movement.performerName || movement.createdByLabel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="size-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">Thời gian hệ thống</p>
                    <p className="mt-1 text-sm font-bold text-secondary-900">{movement.createdAtLabel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="size-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">Kho vật lý</p>
                    <p className="mt-1 text-sm font-bold text-secondary-900">{movement.warehouseName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Hash className="size-4 text-slate-400" />
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">Mã tham chiếu</p>
                    <p className="mt-1 text-sm font-mono font-bold text-primary-700">{movement.refOrderItemId || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 px-1">Ghi chú & Lý do</h4>
                <div className="rounded-3xl bg-primary-50 p-5 text-sm font-medium leading-relaxed text-primary-900 border border-primary-100">
                  {movement.reason ? <p className="font-bold text-primary-950 mb-1">{movement.reason}</p> : null}
                  {movement.note || 'Không có ghi chú thêm.'}
                </div>
              </div>

              <div className="space-y-3 pb-8">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Chứng từ đính kèm</h4>
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
                        className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-3 transition-all hover:border-primary-200 hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600">
                            <FileText className="size-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">Chung_tu_kho_{idx + 1}.pdf</p>
                            <p className="text-[10px] font-medium text-slate-400">1.2 MB · PDF</p>
                          </div>
                        </div>
                        <ExternalLink className="size-3 text-slate-300 group-hover:text-primary-600" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border-2 border-dashed border-slate-100 py-8 text-center bg-slate-50/20">
                    <input 
                      type="file" 
                      id="drawer-file-upload" 
                      className="hidden" 
                      multiple 
                      onChange={() => toast.success('Đã chọn file thành công (Simulated)')}
                    />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Không có chứng từ</p>
                    <label 
                      htmlFor="drawer-file-upload"
                      className="mt-3 inline-flex items-center gap-2 cursor-pointer bg-primary-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-primary-700 transition-all shadow-md shadow-primary-100 active:scale-95"
                    >
                      <Upload className="size-3" />
                      Tải lên chứng minh
                    </label>
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="border-t border-slate-100 p-6 md:px-8 bg-slate-50/50">
            {!isVerified ? (
              <Button 
                onClick={() => {
                  setIsVerified(true)
                  toast.success('Xác nhận biến động thành công. Dữ liệu đã được ghi vào Audit Trail.')
                }}
                className="w-full h-12 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="size-4 text-emerald-400" />
                Xác nhận & Đóng Audit
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-2 py-3 text-slate-400 font-bold text-[11px] uppercase tracking-widest bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                <CheckCircle2 className="size-4 text-emerald-500" />
                Quản trị viên đã xác nhận
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
