import { ArrowDownLeft, ArrowUpRight, MoveRight, FileText, AlertTriangle, User } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { InventoryStockMovementRecord } from '@/features/inventory/logic/inventoryStockMovements.types'
import { buildMovementMetadata } from '@/features/inventory/logic/inventoryStockMovements.logic'

type InventoryStockMovementCardProps = {
  movement: InventoryStockMovementRecord
  isSelected: boolean
  onSelect: (movementId: string) => void
}

const toneClassMap = {
  emerald: 'border-emerald-100 bg-emerald-50 text-emerald-800',
  amber: 'border-amber-100 bg-amber-50 text-amber-800',
  indigo: 'border-primary-100 bg-primary-50 text-primary-800',
  rose: 'border-rose-100 bg-rose-50 text-rose-800',
  slate: 'border-slate-200 bg-slate-100 text-slate-700',
} as const

const toneDotClassMap = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  indigo: 'bg-primary-600',
  rose: 'bg-rose-500',
  slate: 'bg-slate-400',
} as const

const platformToneClassMap = {
  shopee: 'bg-[#fff1e8] text-[#c2410c]',
  lazada: 'bg-primary-100 text-primary-800',
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
        'group w-full rounded-[20px] border bg-white p-4 text-left shadow-sm transition-all duration-300 outline-none',
        'hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary-300',
        'active:scale-[0.99] active:duration-75',
        'focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        isSelected ? 'border-primary-600 ring-4 ring-primary-50 shadow-lg' : 'border-slate-100',
      )}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
            {movement.imageUrl ? <img src={movement.imageUrl} alt={movement.productName} className="h-full w-full object-cover" /> : <MoveRight className="size-4 text-slate-400" />}
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${platformToneClassMap[movement.platform as keyof typeof platformToneClassMap] || 'bg-slate-100 text-slate-600'}`}>
                {movement.platformLabel}
              </span>
              <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${toneClassMap[movement.movementTone]}`}>
                {metadata.movementTypeLabel}
              </span>
              {movement.isAnomaly && (
                <span 
                  title="Số lượng biến động lớn hơn 200% so với mức trung bình 30 ngày qua của SKU này."
                  className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-800 animate-pulse cursor-help"
                >
                  <AlertTriangle className="size-3" />
                  Bất thường
                </span>
              )}
            </div>

            <div>
              <p className="text-[15px] font-bold leading-6 text-secondary-900">{movement.productName}</p>
              <p className="text-xs font-mono text-slate-500">{movement.sku}{movement.variantName ? ` · ${movement.variantName}` : ''}</p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">{movement.warehouseName}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-medium">
                <User className="size-3" />
                {movement.performerName || movement.createdByLabel}
              </span>
              {movement.attachments && movement.attachments.length > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 font-medium text-primary-700">
                  <FileText className="size-3" />
                  {movement.attachments.length} chứng từ
                </span>
              )}
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
          <p className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${isInbound ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {isInbound ? <ArrowUpRight className="size-3.5" /> : <ArrowDownLeft className="size-3.5" />}
            {isInbound ? 'Nhập' : 'Xuất'}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Nhóm</p>
          <p className="mt-1 text-sm font-semibold text-secondary-900">{metadata.movementGroupLabel}</p>
        </div>
      </div>

      {movement.note || movement.reason ? (
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
          {movement.reason ? `${movement.reason}. ` : ''}
          {movement.note ?? ''}
        </p>
      ) : null}
    </button>
  )
}