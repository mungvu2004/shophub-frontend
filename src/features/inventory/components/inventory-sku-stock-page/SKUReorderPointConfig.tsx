import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BellRing, ShieldCheck, Zap, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import type { ReorderConfig } from '@/types/inventory.types';
import { toast } from 'sonner';

export type SKUReorderPointConfigProps = {
  isOpen: boolean;
  onClose: () => void;
  sku: string;
  productName: string;
  initialConfig?: ReorderConfig | null;
  onSave: (config: ReorderConfig) => void;
};

export function SKUReorderPointConfig({ isOpen, onClose, sku, productName, initialConfig, onSave }: SKUReorderPointConfigProps) {
  const [minThreshold, setMinThreshold] = useState(initialConfig?.minThreshold || 10);
  const [reorderQty, setReorderQty] = useState(initialConfig?.reorderQty || 50);
  const [isAutoReorder, setIsAutoReorder] = useState(initialConfig?.isAutoReorder || false);

  const handleSave = () => {
    onSave({
      sku,
      minThreshold,
      reorderQty,
      isAutoReorder,
    });
    toast.success('Đã cập nhật cấu hình Reorder Point');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-3xl border-slate-200 bg-white p-0 shadow-2xl overflow-hidden">
        <div className="relative isolate px-6 py-8 sm:px-10">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(249,115,22,0.06),_transparent_40%)]" />
          
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 shadow-sm border border-orange-100">
                <BellRing className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-slate-900">Cấu hình Reorder Point</DialogTitle>
                <DialogDescription className="text-sm text-slate-500">
                  {productName} ({sku})
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Ngưỡng tồn tối thiểu</label>
                  <HelpCircle className="h-4 w-4 text-slate-300 cursor-help" />
                </div>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={minThreshold}
                    onChange={(e) => setMinThreshold(parseInt(e.target.value))}
                    className="rounded-2xl border-slate-200 bg-slate-50/50 py-6 pl-4 pr-12 text-lg font-black focus:ring-orange-500/20 focus:border-orange-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 italic">đơn vị</span>
                </div>
                <p className="text-[10px] text-slate-400 italic font-medium">Hệ thống sẽ gửi thông báo khi tồn kho thấp hơn mức này.</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Số lượng đặt lại dự kiến</label>
                  <ShieldCheck className="h-4 w-4 text-slate-300" />
                </div>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={reorderQty}
                    onChange={(e) => setReorderQty(parseInt(e.target.value))}
                    className="rounded-2xl border-slate-200 bg-slate-50/50 py-6 pl-4 pr-12 text-lg font-black focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

              <div 
                onClick={() => setIsAutoReorder(!isAutoReorder)}
                className={`flex items-center gap-4 p-4 rounded-3xl border transition-all cursor-pointer ${isAutoReorder ? 'bg-orange-50/50 border-orange-200 shadow-sm' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all ${isAutoReorder ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200'}`}>
                  <Zap className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-900 leading-none">Tự động tạo đơn đặt hàng</p>
                  <p className="mt-1 text-xs text-slate-500 font-medium italic">Kích hoạt quy trình đặt hàng AI khi chạm ngưỡng.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-10">
            <Button 
              className="w-full rounded-2xl bg-slate-900 py-6 text-sm font-black uppercase tracking-widest text-white shadow-xl hover:bg-slate-800 transition-all active:scale-95"
              onClick={handleSave}
            >
              Lưu cấu hình
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
