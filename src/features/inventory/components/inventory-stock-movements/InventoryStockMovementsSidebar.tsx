import { Store } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type {
  InventoryStockMovementPlatformViewModel,
  InventoryStockMovementRecord,
  InventoryStockMovementWarehouseViewModel,
} from '@/features/inventory/logic/inventoryStockMovements.types'

type InventoryStockMovementsSidebarProps = {
  selectedMovement: InventoryStockMovementRecord | null
  platformStats: InventoryStockMovementPlatformViewModel[]
  warehouseStats: InventoryStockMovementWarehouseViewModel[]
  lazadaNote: string
}

const platformToneClassMap = {
  shopee: 'bg-[#fff1e8] text-[#c2410c]',
  lazada: 'bg-[#e0e7ff] text-[#4338ca]',
  tiktok_shop: 'bg-slate-900 text-white',
  all: 'bg-slate-100 text-slate-600',
} as const

const barToneClassMap = {
  shopee: 'bg-[#EE4D2D]',
  lazada: 'bg-[#4f46e5]',
  tiktok_shop: 'bg-slate-900',
  all: 'bg-slate-400',
} as const

const unitToneClassMap = {
  shopee: 'text-[#c2410c]',
  lazada: 'text-[#4338ca]',
  tiktok_shop: 'text-slate-900',
  all: 'text-slate-500',
} as const

export function InventoryStockMovementsSidebar({
  selectedMovement,
  platformStats,
  warehouseStats,
  lazadaNote,
}: InventoryStockMovementsSidebarProps) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-6">
      <Card className="gap-0 overflow-hidden border border-slate-100 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Chi tiết biến động</p>

        {selectedMovement ? (
          <div className="mt-4 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-[#111c2d]">{selectedMovement.productName}</p>
                <p className="mt-1 text-xs text-slate-500">{selectedMovement.sku} · {selectedMovement.platformLabel}</p>
              </div>
              <span className={cn('rounded-full px-3 py-1 text-xs font-bold', selectedMovement.delta > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700')}>
                {selectedMovement.deltaLabel}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Kho</p>
                <p className="mt-1 font-semibold text-slate-700">{selectedMovement.warehouseName}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Nhóm</p>
                <p className="mt-1 font-semibold text-slate-700">{selectedMovement.movementTypeLabel}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Trước</p>
                <p className="mt-1 font-mono font-semibold text-slate-700">{selectedMovement.qtyBefore}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Sau</p>
                <p className="mt-1 font-mono font-semibold text-slate-700">{selectedMovement.qtyAfter}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm text-[#111c2d]">
              <p className="font-semibold text-[#3525cd]">Ghi chú</p>
              <p className="mt-2 leading-6 text-slate-600">
                {selectedMovement.reason ?? 'Không có lý do bổ sung.'}
                {selectedMovement.note ? ` ${selectedMovement.note}` : ''}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${platformToneClassMap[selectedMovement.platform]}`}>{selectedMovement.platformLabel}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{selectedMovement.createdAtLabel}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{selectedMovement.createdByLabel}</span>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-slate-500">Chọn một biến động để xem chi tiết.</p>
        )}
      </Card>

      <Card className="gap-0 overflow-hidden border border-slate-100 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Phân bổ theo sàn</p>
            <p className="mt-1 text-sm text-slate-500">Lazada được hiển thị riêng.</p>
          </div>
          <Store className="size-4 text-[#3525cd]" />
        </div>

        <div className="mt-4 space-y-4">
          {platformStats.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                <span className={cn('rounded-full px-2.5 py-1', platformToneClassMap[item.id])}>{item.label}</span>
                <span className={unitToneClassMap[item.id]}>
                  {item.count} · {item.qtyDelta > 0 ? '+' : ''}{item.qtyDelta}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className={cn('h-full rounded-full', barToneClassMap[item.id])} style={{ width: `${Math.max(item.percentage, item.id === 'all' ? 100 : 8)}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl bg-[#eef2ff] p-4 text-sm leading-6 text-slate-600">
          {lazadaNote}
        </div>
      </Card>

      <Card className="gap-0 overflow-hidden border border-slate-100 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Kho hoạt động mạnh</p>

        <div className="mt-4 space-y-3">
          {warehouseStats.map((item, index) => (
            <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <p className="font-semibold text-[#111c2d]">{item.label}</p>
                <span className="text-xs font-bold text-slate-500">{item.count} biến động</span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                <span className="rounded-full bg-white px-2.5 py-1 font-semibold shadow-sm">{index + 1}</span>
                <span className={item.qtyDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {item.qtyDelta >= 0 ? '+' : ''}{item.qtyDelta} tồn ròng
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </aside>
  )
}