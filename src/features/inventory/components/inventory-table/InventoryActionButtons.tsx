import { useRef, useEffect } from 'react';
import { ChevronRight, Edit2, QrCode, Package, BellRing, DollarSign, MoreHorizontal, X, Trash2 } from 'lucide-react';
import type { InventoryTableRow } from '../../logic/inventoryTable.types';
import { cn } from '@/lib/utils';
import { ACTION_MENU_CONFIG } from '../../logic/inventory.constants';

type InventoryActionButtonsProps = {
  row: InventoryTableRow;
  isOpen?: boolean;
  isLastRow?: boolean;
  onToggle?: () => void;
  onOpenQRCode?: (sku: string, name: string) => void;
  onOpenBatchManagement?: (sku: string, name: string) => void;
  onOpenReorderConfig?: (sku: string, name: string) => void;
  onOpenCostHistory?: (sku: string, name: string) => void;
  onEditRow?: (rowId: string, productId?: string) => void;
  onOpenProductDetail?: (rowId: string, productId?: string) => void;
  onDeleteRow?: (rowId: string) => void;
};

export function InventoryActionButtons({
  row,
  isOpen,
  isLastRow,
  onToggle,
  onOpenQRCode,
  onOpenBatchManagement,
  onOpenReorderConfig,
  onOpenCostHistory,
  onEditRow,
  onOpenProductDetail,
  onDeleteRow,
}: InventoryActionButtonsProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Logic click outside để đóng menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onToggle?.();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const actions = [
    { 
      icon: QrCode, 
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100', 
      title: 'Mã QR',
      label: `Xem mã QR SKU ${row.sku}`,
      onClick: () => onOpenQRCode?.(row.sku, row.productName) 
    },
    { 
      icon: Package, 
      color: 'text-sky-600 bg-sky-50 border-sky-100 hover:bg-sky-100', 
      title: 'Lô & HSD',
      label: `Quản lý lô và hạn sử dụng SKU ${row.sku}`,
      onClick: () => onOpenBatchManagement?.(row.sku, row.productName) 
    },
    { 
      icon: BellRing, 
      color: 'text-orange-600 bg-orange-50 border-orange-100 hover:bg-orange-100', 
      title: 'Cảnh báo',
      label: `Cấu hình cảnh báo tồn kho SKU ${row.sku}`,
      onClick: () => onOpenReorderConfig?.(row.sku, row.productName) 
    },
    { 
      icon: DollarSign, 
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100 hover:bg-emerald-100', 
      title: 'Giá vốn',
      label: `Xem lịch sử giá vốn SKU ${row.sku}`,
      onClick: () => onOpenCostHistory?.(row.sku, row.productName) 
    },
    { 
      icon: Trash2, 
      color: 'text-red-600 bg-red-50 border-red-100 hover:bg-red-100', 
      title: 'Xóa SKU',
      label: `Xóa SKU ${row.sku} khỏi hệ thống`,
      onClick: () => {
        if (confirm(`Bạn có chắc muốn xóa SKU ${row.sku}?`)) {
          onDeleteRow?.(row.id);
        }
      } 
    },
  ];

  // Nếu là dòng cuối, xoay cung tròn hướng lên TRÊN (từ 180 đến 260 độ) để tránh bị cắt ở đáy bảng
  const startAngle = isLastRow ? 180 : ACTION_MENU_CONFIG.START_ANGLE;
  const endAngle = isLastRow ? 260 : ACTION_MENU_CONFIG.END_ANGLE;
  const radius = isLastRow ? 65 : ACTION_MENU_CONFIG.RADIUS;

  return (
    <div className="flex items-center justify-end gap-2 px-2 h-full" ref={menuRef}>
      {/* Nhóm hành động chính */}
      <div className="flex items-center gap-1">
        <button 
          type="button" 
          className="p-2.5 hover:bg-indigo-50 rounded-full text-slate-600 hover:text-indigo-600 transition-all active:scale-90"
          onClick={(e) => { e.stopPropagation(); onEditRow?.(row.id, row.productId); }}
          title="Chỉnh sửa"
          aria-label={`Chỉnh sửa thông tin sản phẩm ${row.productName}`}
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-2.5 hover:bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 transition-all active:scale-90"
          onClick={(e) => { e.stopPropagation(); onOpenProductDetail?.(row.id, row.productId); }}
          title="Chi tiết"
          aria-label={`Xem chi tiết tồn kho ${row.productName}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-slate-100 mx-1" />

      {/* Circular Menu cho hành động phụ */}
      <div className="relative flex items-center justify-center">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={isOpen ? "Đóng menu hành động" : "Mở thêm hành động"}
          className={cn(
            "z-[60] p-3 rounded-full transition-all shadow-md border outline-none focus:ring-2 focus:ring-indigo-500/20",
            isOpen 
              ? "bg-slate-900 text-white border-slate-900 scale-110 rotate-90" 
              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          )}
          style={{ transitionDuration: `${ACTION_MENU_CONFIG.ANIMATION_DURATION}ms` }}
        >
          {isOpen ? <X className="size-4" /> : <MoreHorizontal className="size-4" />}
        </button>

        {/* Các nút bung ra - Tối ưu hiệu suất với will-change */}
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all will-change-transform",
          isOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-50 invisible pointer-events-none"
        )} style={{ transitionDuration: `${ACTION_MENU_CONFIG.ANIMATION_DURATION}ms` }}>
          {actions.map((action, idx) => {
            const Icon = action.icon;
            const angle = startAngle + (idx * (endAngle - startAngle) / (actions.length - 1));
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;

            return (
              <button
                key={action.title}
                type="button"
                aria-label={action.label}
                className={cn(
                  "group/action absolute flex items-center justify-center w-10 h-10 rounded-full shadow-xl border transition-all active:scale-75 outline-none focus:ring-2 focus:ring-indigo-500/40",
                  action.color
                )}
                style={{
                  transform: isOpen ? `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` : 'translate(-50%, -50%)',
                  transitionDelay: isOpen ? `${idx * 40}ms` : '0ms',
                  transitionDuration: `${ACTION_MENU_CONFIG.ANIMATION_DURATION}ms`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                  onToggle?.();
                }}
              >
                <Icon className="size-4" />
                {/* Chỉ hiện nhãn khi chính nút (group/action) này được hover */}
                <span className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 scale-50 opacity-0 transition-all duration-200 group-hover/action:scale-100 group-hover/action:opacity-100 text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap bg-slate-900 px-2 py-1 rounded shadow-2xl z-[100]">
                  {action.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}




