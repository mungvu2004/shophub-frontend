import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { TrendingUp, TrendingDown, DollarSign, Activity, ArrowRight } from 'lucide-react';
import type { CostHistoryEntry } from '@/types/inventory.types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export type SKUCostHistoryChartProps = {
  isOpen: boolean;
  onClose: () => void;
  sku: string;
  productName: string;
  history: CostHistoryEntry[];
  isLoading: boolean;
};

export function SKUCostHistoryChart({ isOpen, onClose, sku, productName, history, isLoading }: SKUCostHistoryChartProps) {
  const currentCost = history.length > 0 ? history[history.length - 1].costPrice : 0;
  const previousCost = history.length > 1 ? history[history.length - 2].costPrice : currentCost;
  const changePercent = previousCost > 0 ? ((currentCost - previousCost) / previousCost) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl rounded-3xl border-slate-200 bg-white p-0 shadow-2xl overflow-hidden">
        <div className="relative isolate px-6 py-8 sm:px-10">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(5,150,105,0.06),_transparent_40%)]" />
          
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-slate-900">Lịch sử Giá vốn (Inventory Value)</DialogTitle>
                <DialogDescription className="text-sm text-slate-500">
                  {productName} ({sku})
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-5 rounded-3xl border border-slate-100 bg-white shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Giá vốn hiện tại</p>
              <p className="mt-2 text-2xl font-black text-slate-900 leading-none">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentCost)}
              </p>
            </div>
            <div className="p-5 rounded-3xl border border-slate-100 bg-white shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Biến động (30 ngày)</p>
              <div className="mt-2 flex items-center gap-2">
                <p className={`text-2xl font-black leading-none ${changePercent >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
                </p>
                {changePercent >= 0 ? <TrendingUp className="h-5 w-5 text-red-500" /> : <TrendingDown className="h-5 w-5 text-emerald-500" />}
              </div>
            </div>
            <div className="p-5 rounded-3xl border border-slate-100 bg-white shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phương pháp tính</p>
              <p className="mt-2 text-lg font-black text-indigo-600 leading-none">WEIGHTED AVG</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Activity className="h-4 w-4 text-indigo-500" />
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">Nhật ký biến động giá</h4>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/50">
              <div className="max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-sm z-10 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ngày ghi nhận</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Giá vốn mới</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nguồn dữ liệu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {history.map((entry) => (
                        <tr key={entry.id} className="hover:bg-white transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-slate-700">
                              {format(new Date(entry.date), 'dd MMM, yyyy', { locale: vi })}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-black text-slate-900 font-mono">
                              {new Intl.NumberFormat('vi-VN').format(entry.costPrice)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] rounded-lg border-slate-200 bg-white font-bold text-slate-500">
                                {entry.sourceType}
                              </Badge>
                              <ArrowRight className="h-3 w-3 text-slate-300" />
                              <span className="text-xs font-mono text-slate-400 tracking-tighter">{entry.sourceId}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
