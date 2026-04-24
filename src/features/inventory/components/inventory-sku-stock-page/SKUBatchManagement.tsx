import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, Info, Clock, AlertTriangle } from 'lucide-react';
import type { StockBatch } from '@/types/inventory.types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export type SKUBatchManagementProps = {
  isOpen: boolean;
  onClose: () => void;
  sku: string;
  productName: string;
  batches: StockBatch[];
  isLoading: boolean;
};

export function SKUBatchManagement({ isOpen, onClose, sku, productName, batches, isLoading }: SKUBatchManagementProps) {
  const isNearExpiry = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiry <= threeMonthsFromNow;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl rounded-3xl border-slate-200 bg-white p-0 shadow-2xl overflow-hidden">
        <div className="relative isolate px-6 py-8 sm:px-10">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(14,116,144,0.06),_transparent_40%)]" />
          
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 shadow-sm border border-sky-100">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-slate-900">Quản lý lô hàng & Hạn sử dụng</DialogTitle>
                <DialogDescription className="text-sm text-slate-500">
                  {productName} ({sku})
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-500 italic">Đang tải danh sách lô hàng...</p>
              </div>
            ) : batches.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md border border-slate-50 mx-auto">
                  <Info className="h-8 w-8 text-slate-300" />
                </div>
                <p className="mt-4 text-slate-600 font-bold">Chưa có thông tin lô hàng</p>
                <p className="text-xs text-slate-400 mt-1">Vui lòng nhập lô hàng mới trong phần Nhập kho.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {batches.map((batch) => (
                  <div 
                    key={batch.id} 
                    className="group relative rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-indigo-100"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black tracking-widest uppercase text-slate-400">Số lô:</span>
                          <code className="text-sm font-bold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-lg border border-indigo-100/50">
                            {batch.batchNumber}
                          </code>
                          {isNearExpiry(batch.expiryDate) && (
                            <Badge variant="destructive" className="rounded-full px-2 py-0 animate-pulse">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Sắp hết hạn
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-6">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-500">Ngày nhập:</span>
                            <span className="font-bold text-slate-700">
                              {format(new Date(batch.receivedDate), 'dd MMM, yyyy', { locale: vi })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-500">Hạn dùng:</span>
                            <span className={`font-bold ${isNearExpiry(batch.expiryDate) ? 'text-red-600' : 'text-slate-700'}`}>
                              {batch.expiryDate ? format(new Date(batch.expiryDate), 'dd MMM, yyyy', { locale: vi }) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right bg-slate-50/80 px-4 py-2 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Số lượng tồn</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tight">{batch.quantity}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="text-xs text-slate-400">
                        Giá vốn: <span className="font-bold text-slate-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(batch.costPrice)}</span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Kho: <span className="font-bold text-slate-600 uppercase tracking-tighter">{batch.warehouseId}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
