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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedMovement: _selectedMovement,
  platformStats,
  warehouseStats,
  lazadaNote,
}: InventoryStockMovementsSidebarProps) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-6">
      <Card className="gap-0 overflow-hidden border border-slate-100 bg-white p-5 rounded-3xl shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Phân bổ theo sàn</p>
            <p className="mt-1 text-[10px] font-bold text-primary-600 uppercase tracking-widest">Live Sync Status</p>
          </div>
          <Store className="size-5 text-primary-600" />
        </div>

        <div className="mt-6 space-y-5">
          {platformStats.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span className={cn('rounded-lg px-2 py-0.5', platformToneClassMap[item.id])}>{item.label}</span>
                <span className={unitToneClassMap[item.id]}>
                  {item.count} Lệnh · {item.qtyDelta > 0 ? '+' : ''}{item.qtyDelta} Tồn
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className={cn('h-full rounded-full transition-all duration-1000', barToneClassMap[item.id])} style={{ width: `${Math.max(item.percentage, item.id === 'all' ? 100 : 8)}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-primary-50 p-4 border border-primary-100">
          <p className="text-[10px] font-bold text-primary-700 leading-relaxed italic">
            * {lazadaNote}
          </p>
        </div>
      </Card>

      <Card className="gap-0 overflow-hidden border border-slate-100 bg-white p-5 rounded-3xl shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Kho hoạt động mạnh</p>

        <div className="mt-5 space-y-3">
          {warehouseStats.map((item, index) => (
            <div key={item.id} className="rounded-2xl bg-slate-50 p-3 transition-colors hover:bg-slate-100/50">
              <div className="flex items-center justify-between gap-3 text-sm">
                <p className="font-bold text-slate-900">{item.label}</p>
                <span className="text-[10px] font-black text-slate-400 uppercase">{item.count} Biến động</span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                <span className="flex size-5 items-center justify-center rounded-lg bg-white font-black text-[10px] shadow-sm ring-1 ring-slate-100 text-slate-400">{index + 1}</span>
                <span className={cn('font-bold', item.qtyDelta >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
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