import { cn } from '@/lib/utils'
import { getStatusColor, STATUS_COLORS } from '@/constants/statusColors'
import { MESSAGES } from '@/constants/messages'

type InventoryStockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'
type AdjustmentStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'DRAFT'
type MovementDirection = 'IMPORT' | 'EXPORT'

interface InventoryStatusBadgeProps {
  status: string
  type?: 'stock' | 'adjustment' | 'movement'
  className?: string
  showDot?: boolean
}

const STOCK_STATUS_MAP: Record<InventoryStockStatus, { label: string; color: keyof typeof STATUS_COLORS }> = {
  'in-stock': { label: MESSAGES.INVENTORY.SKU.STATUS.IN_STOCK, color: 'success' },
  'low-stock': { label: MESSAGES.INVENTORY.SKU.STATUS.LOW_STOCK, color: 'warning' },
  'out-of-stock': { label: MESSAGES.INVENTORY.SKU.STATUS.OUT_OF_STOCK, color: 'error' },
}

const ADJUSTMENT_STATUS_MAP: Record<AdjustmentStatus, { label: string; color: keyof typeof STATUS_COLORS }> = {
  'PENDING_APPROVAL': { label: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.STATUS.PENDING, color: 'pending' },
  'APPROVED': { label: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.STATUS.APPROVED, color: 'success' },
  'REJECTED': { label: MESSAGES.INVENTORY.STOCK_ADJUSTMENT.STATUS.REJECTED, color: 'error' },
  'COMPLETED': { label: 'Hoàn thành', color: 'success' },
  'DRAFT': { label: 'Nháp', color: 'inactive' },
}

const MOVEMENT_STATUS_MAP: Record<MovementDirection, { label: string; color: keyof typeof STATUS_COLORS }> = {
  'IMPORT': { label: 'Nhập kho', color: 'success' },
  'EXPORT': { label: 'Xuất kho', color: 'processing' },
}

export function InventoryStatusBadge({
  status,
  type = 'stock',
  className,
  showDot = true,
}: InventoryStatusBadgeProps) {
  const normalizedStatus = status.toLowerCase().replace(/[_\s]/g, '-')

  let config: { label: string; color: keyof typeof STATUS_COLORS } | undefined

  if (type === 'stock') {
    config = STOCK_STATUS_MAP[normalizedStatus as InventoryStockStatus]
  } else if (type === 'adjustment') {
    config = ADJUSTMENT_STATUS_MAP[status as AdjustmentStatus]
  } else if (type === 'movement') {
    config = MOVEMENT_STATUS_MAP[status as MovementDirection]
  }

  // Fallback to generic status color mapping
  if (!config) {
    const genericColor = getStatusColor(status)
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
          genericColor.bg,
          genericColor.text,
          className
        )}
      >
        {showDot && (
          <span className={cn('size-1.5 rounded-full', genericColor.dot)} />
        )}
        {status}
      </span>
    )
  }

  const colors = STATUS_COLORS[config.color]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        colors.bg,
        colors.text,
        className
      )}
    >
      {showDot && (
        <span className={cn('size-1.5 rounded-full', colors.dot)} />
      )}
      {config.label}
    </span>
  )
}

// Convenience exports for specific status types
export function StockStatusBadge({ status, className }: { status: string; className?: string }) {
  return <InventoryStatusBadge status={status} type="stock" className={className} />
}

export function AdjustmentStatusBadge({ status, className }: { status: string; className?: string }) {
  return <InventoryStatusBadge status={status} type="adjustment" className={className} />
}

export function MovementStatusBadge({ status, className }: { status: string; className?: string }) {
  return <InventoryStatusBadge status={status} type="movement" className={className} />
}
