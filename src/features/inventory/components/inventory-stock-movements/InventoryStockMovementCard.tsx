import { ArrowDownLeft, ArrowUpRight, MoveRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { InventoryStockMovementRecord } from '@/features/inventory/logic/inventoryStockMovements.types'
import { buildMovementMetadata } from '@/features/inventory/logic/inventoryStockMovements.logic'

type InventoryStockMovementCardProps = {
  movement: InventoryStockMovementRecord
  isSelected: boolean
  onSelect: (movementId: string) => void
}

const toneClassMap = {
  emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-100 bg-amber-50 text-amber-700',
  indigo: 'border-indigo-100 bg-indigo-50 text-[#3525cd]',
  rose: 'border-rose-100 bg-rose-50 text-rose-700',
  slate: 'border-slate-100 bg-slate-100 text-slate-600',
} as const

const toneDotClassMap = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  indigo: 'bg-[#3525cd]',
  rose: 'bg-rose-500',
  slate: 'bg-slate-400',
} as const

const platformToneClassMap = {
  shopee: 'bg-[#fff1e8] text-[#c2410c]',
  lazada: 'bg-[#e0e7ff] text-[#4338ca]',
  tiktok_shop: 'bg-slate-900 text-white',
} as const

export function InventoryStockMovementCard({ movement, isSelected, onSelect }: InventoryStockMovementCardProps) {
  const metadata = buildMovementMetadata(movement)
  const isInbound = movement.delta > 0

  return (
    <button
      type="button"
      onClick={() => onSelect(String(movement.id))}
      className={cn(
        'group w-full rounded-[20px] border bg-white p-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]',
        isSelected ? 'border-[#3525cd] ring-2 ring-indigo-100' : 'border-slate-100',
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
            {movement.imageUrl ? <img src={movement.imageUrl} alt={movement.productName} className="h-full w-full object-cover" /> : <MoveRight className="size-4 text-slate-400" />}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${platformToneClassMap[movement.platform]}`}>
                {movement.platformLabel}
              </span>
              <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${toneClassMap[movement.movementTone]}`}>
                {metadata.movementTypeLabel}
              </span>
            </div>

            <div>
              <p className="text-[15px] font-bold leading-6 text-[#111c2d]">{movement.productName}</p>
              <p className="text-xs font-mono text-slate-400">{movement.sku}{movement.variantName ? ` · ${movement.variantName}` : ''}</p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">{movement.warehouseName}</span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">{movement.createdByLabel}</span>
              {movement.refOrderItemId ? <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">{movement.refOrderItemId}</span> : null}
            </div>
          </div>
        </div>

        <div className="flex min-w-[190px] flex-col items-start gap-3 md:items-end">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${toneClassMap[movement.movementTone]}`}>
            <span className={`size-2 rounded-full ${toneDotClassMap[movement.movementTone]}`} />
            {movement.deltaLabel} units
          </span>

          <div className="text-right text-xs text-slate-500">
            <p>{movement.createdAtLabel}</p>
            <p className="font-mono">{movement.warehouseId}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 rounded-[16px] bg-slate-50 px-4 py-3 md:grid-cols-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Trước</p>
          <p className="mt-1 font-mono text-sm font-semibold text-slate-700">{movement.qtyBefore}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Sau</p>
          <p className="mt-1 font-mono text-sm font-semibold text-slate-700">{movement.qtyAfter}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Hướng biến động</p>
          <p className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${isInbound ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {isInbound ? <ArrowUpRight className="size-3.5" /> : <ArrowDownLeft className="size-3.5" />}
            {isInbound ? 'Nhập' : 'Xuất'}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Nhóm</p>
          <p className="mt-1 text-sm font-semibold text-[#111c2d]">{metadata.movementGroupLabel}</p>
        </div>
      </div>

      {movement.note || movement.reason ? (
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
          {movement.reason ? `${movement.reason}. ` : ''}
          {movement.note ?? ''}
        </p>
      ) : null}
    </button>
  )
}