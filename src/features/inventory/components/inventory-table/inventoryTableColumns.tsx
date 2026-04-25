import { Package, Smartphone, Store, Globe, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DataTableColumn } from '@/components/shared/DataTable';
import type { InventoryTableRow, InventoryTableViewModel } from './inventoryTable.types';
import { InventoryStatusBadge } from './InventoryStatusBadge';
import { InventoryStockCell } from './InventoryStockCell';
import { InventoryActionButtons } from './InventoryActionButtons';
import { INVENTORY_STATUS_CONFIG, INVENTORY_COLORS } from '../../logic/inventory.constants';

export const getInventoryColumns = (model: InventoryTableViewModel): DataTableColumn<InventoryTableRow>[] => {
  const isAllSelected = model.selectedRows.length === model.rows.length && model.rows.length > 0;

  const columnDefinitions: Record<string, Partial<DataTableColumn<InventoryTableRow>>> = {
    select: {
      header: (
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={(e) => model.onSelectAll(e.target.checked)}
          className="w-5 h-5 cursor-pointer accent-indigo-600 rounded"
          aria-label="Chọn tất cả SKU"
        />
      ),
      widthClassName: 'w-14 min-w-14 sticky left-0 z-30 bg-white border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]',
      cellClassName: (row) => cn(
        'sticky left-0 z-20 transition-all duration-300 border-r border-slate-100',
        model.selectedRows.includes(row.id) ? 'bg-indigo-50/50' : 'bg-white'
      ),
      cell: (row) => (
        <div className="flex items-center justify-center relative h-full py-4">
          <div className={cn(
            "absolute left-0 top-0 bottom-0 w-1",
            INVENTORY_STATUS_CONFIG[row.status].indicatorColor
          )} />
          <input
            type="checkbox"
            checked={model.selectedRows.includes(row.id)}
            onChange={() => model.onSelectRow(row.id)}
            className="w-5 h-5 cursor-pointer accent-indigo-600 rounded"
            aria-label={`Chọn sản phẩm ${row.productName}`}
          />
        </div>
      ),
    },
    image: {
      align: 'center',
      widthClassName: 'w-20 min-w-20',
      cellClassName: 'py-4',
      cell: (row) => (
        <div className="relative group mx-auto w-12 h-12">
          {row.image ? (
            <img src={row.image} alt={row.productName} className="w-full h-full rounded-xl border border-slate-200 object-cover shadow-sm transition-transform group-hover:scale-110" />
          ) : (
            <div className="w-full h-full rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300"><Package className="w-6 h-6" /></div>
          )}
          <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5" />
        </div>
      ),
    },
    productName: {
      widthClassName: 'min-w-[240px]',
      cellClassName: 'max-w-xs py-4',
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); model.onOpenProductDetail?.(row.id, row.productId); }}
            className="text-left text-[14px] font-black text-slate-900 leading-tight hover:text-indigo-600 transition-colors line-clamp-2 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 rounded"
            aria-label={`Mở chi tiết sản phẩm ${row.productName}`}
          >
            {row.productName}
          </button>
          <div className="flex items-center gap-1.5">
            <Package className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{row.sku}</span>
          </div>
        </div>
      ),
    },
    sku: {
      widthClassName: 'w-[110px]',
      cellClassName: 'py-4',
      cell: (row) => (
        <code className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-black font-mono text-slate-700 tracking-tighter">
          {row.sku}
        </code>
      ),
    },
    category: {
      header: 'Phân loại',
      widthClassName: 'w-[120px]',
      cell: (row) => {
        const cat = row.category?.toLowerCase() || '';
        let colors = INVENTORY_COLORS.CAT_DEFAULT;

        if (cat.includes('áo')) colors = INVENTORY_COLORS.CAT_AO;
        else if (cat.includes('váy')) colors = INVENTORY_COLORS.CAT_VAY;
        else if (cat.includes('quần')) colors = INVENTORY_COLORS.CAT_QUAN;
        else if (cat.includes('giày')) colors = INVENTORY_COLORS.CAT_GIAY;
        else if (cat.includes('phụ kiện')) colors = INVENTORY_COLORS.CAT_PHUKIEN;

        return (
          <span className={cn(
            "inline-flex items-center rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest border transition-transform hover:scale-105 shadow-sm",
            colors.bg, colors.text, colors.border
          )}>
            {row.category || 'N/A'}
          </span>
        );
      },
    },
    platformType: {
      header: 'Loại sàn',
      widthClassName: 'w-[130px]',
      cell: (row) => {
        const platform = row.platformType?.toLowerCase() || '';
        const isShopee = platform.includes('shopee');
        const isTikTok = platform.includes('tiktok');
        const isLazada = platform.includes('lazada');

        return (
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center justify-center size-6 rounded shadow-sm border",
              isShopee ? "bg-[#EE4D2D] border-[#EE4D2D] text-white" : 
              isTikTok ? "bg-black border-black text-white" : 
              isLazada ? "bg-[#1019D1] border-[#1019D1] text-white" : 
              "bg-white border-slate-200 text-slate-400"
            )}>
              {isShopee ? <Smartphone className="size-3.5" /> : 
               isTikTok ? <Store className="size-3.5" /> : 
               isLazada ? <Globe className="size-3.5" /> : 
               <Package className="size-3.5" />}
            </div>
            <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate">{row.platformType || 'N/A'}</span>
          </div>
        );
      },
    },

    actualStock: {
      align: 'right',
      header: 'Tồn kho',
      widthClassName: 'w-[100px]',
      sortable: true,
      sortAccessor: (row) => row.actualStock,
      cell: (row) => (
        <InventoryStockCell 
          actualStock={row.actualStock} 
          maxCapacity={row.maxCapacity || 100} 
          status={row.status} 
        />
      ),
    },
    available: {
      align: 'right',
      header: 'Khả dụng',
      widthClassName: 'w-[100px]',
      sortable: true,
      sortAccessor: (row) => row.available,
      cell: (row) => (
        <span className="text-[14px] font-black font-mono text-slate-900 tabular-nums">
          {row.available.toLocaleString()}
        </span>
      ),
    },
    status: {
      header: 'Trạng thái',
      widthClassName: 'w-[120px]',
      sortable: true,
      sortAccessor: (row) => row.status,
      cell: (row) => <InventoryStatusBadge status={row.status} />,
    },
    forecast: {
      header: 'Dự báo AI',
      widthClassName: 'w-[140px]',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Sparkles className="size-3 text-indigo-500 animate-pulse" />
          <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
            {row.restockDays || '-'}
          </span>
        </div>
      ),
    },
    actions: {
      align: 'right',
      widthClassName: 'w-[80px] sticky right-0 z-30 bg-white border-l border-slate-100',
      headerClassName: 'text-right sticky right-0 z-30 bg-white border-l border-slate-100',
      cellClassName: (row) => cn(
        'text-right py-4 sticky right-0 border-l border-slate-100 transition-all duration-300',
        model.activeActionMenuId === row.id ? 'z-[100] bg-slate-50 shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.04)]' : 'z-20 bg-white',
        model.selectedRows.includes(row.id) && model.activeActionMenuId !== row.id ? 'bg-indigo-50/50' : ''
      ),
      cell: (row, index) => {
        const isLastRow = model.rows.indexOf(row) === model.rows.length - 1;
        return (
          <InventoryActionButtons 
            row={row} 
            isOpen={model.activeActionMenuId === row.id}
            isLastRow={isLastRow}
            onToggle={() => model.setActiveActionMenuId?.(model.activeActionMenuId === row.id ? null : row.id)}
            onOpenQRCode={model.onOpenQRCode}
            onOpenBatchManagement={model.onOpenBatchManagement}
            onOpenReorderConfig={model.onOpenReorderConfig}
            onOpenCostHistory={model.onOpenCostHistory}
            onEditRow={model.onEditRow}
            onOpenProductDetail={model.onOpenProductDetail}
          />
        );
      },
    },
  };

  // Tạo danh sách cột cuối cùng dựa trên model.columns
  const baseColumns: DataTableColumn<InventoryTableRow>[] = model.columns.map(col => {
    const def = columnDefinitions[col.id] || {};
    const headerLabel = (def.header || col.label);
    
    return {
      id: col.id,
      header: typeof headerLabel === 'string' ? headerLabel.toUpperCase() : headerLabel,
      align: col.align,
      headerClassName: cn(
        'text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 py-5',
        col.align === 'right' ? 'text-right' : 'text-left',
        def.headerClassName
      ),
      widthClassName: def.widthClassName || 'min-w-[100px]',
      cellClassName: def.cellClassName,
      ...def,
    } as DataTableColumn<InventoryTableRow>;
  });

  // Thêm cột select vào đầu và actions vào cuối nếu chưa có
  const finalColumns = [...baseColumns];
  if (!finalColumns.some(c => c.id === 'select')) {
    finalColumns.unshift({ id: 'select', ...columnDefinitions.select } as any);
  }
  if (!finalColumns.some(c => c.id === 'actions')) {
    finalColumns.push({ id: 'actions', ...columnDefinitions.actions } as any);
  }

  return finalColumns;
};
