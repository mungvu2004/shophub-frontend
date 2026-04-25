import { INVENTORY_STATUS_CONFIG } from '../../logic/inventory.constants';

type InventoryStockCellProps = {
  actualStock: number;
  maxCapacity: number;
  status: keyof typeof INVENTORY_STATUS_CONFIG;
};

export function InventoryStockCell({ actualStock, maxCapacity, status }: InventoryStockCellProps) {
  const percentage = Math.min((actualStock / (maxCapacity || 100)) * 100, 100);
  
  const getProgressBarColor = () => {
    if (status === 'normal') return 'from-emerald-400 to-emerald-600 shadow-emerald-100';
    if (status === 'warning') return 'from-amber-400 to-amber-600 shadow-amber-100';
    if (status === 'discontinued') return 'from-slate-300 to-slate-400 shadow-slate-100';
    return 'from-red-400 to-red-600 shadow-red-100';
  };

  return (
    <div className="flex flex-col items-end gap-1.5 min-w-[80px]">
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-[15px] text-slate-900 font-black leading-none">{actualStock}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">đv</span>
      </div>
      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-700 ease-out bg-gradient-to-r shadow-sm ${getProgressBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
