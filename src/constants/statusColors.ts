export const STATUS_COLORS = {
  active: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  inactive: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  },
  deleted: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    dot: 'bg-yellow-500',
  },
  processing: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  success: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  error: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  warning: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  info: {
    bg: 'bg-sky-100',
    text: 'text-sky-800',
    border: 'border-sky-200',
    dot: 'bg-sky-500',
  },
} as const

export type StatusColorKey = keyof typeof STATUS_COLORS

export function getStatusColor(status: string): (typeof STATUS_COLORS)[StatusColorKey] {
  const normalizedStatus = status.toLowerCase().replace(/[_\s]/g, '')

  const statusMap: Record<string, StatusColorKey> = {
    active: 'active',
    inactive: 'inactive',
    deleted: 'deleted',
    disabled: 'inactive',
    offline: 'inactive',
    pending: 'pending',
    processing: 'processing',
    success: 'success',
    completed: 'success',
    done: 'success',
    cancelled: 'cancelled',
    canceled: 'cancelled',
    error: 'error',
    failed: 'error',
    warning: 'warning',
    warn: 'warning',
    info: 'info',
    information: 'info',
  }

  const key = statusMap[normalizedStatus]
  return key ? STATUS_COLORS[key] : STATUS_COLORS.inactive
}

export const PRODUCT_STATUS_LABELS: Record<string, string> = {
  Active: 'Đang kinh doanh',
  Inactive: 'Tạm dừng',
  Deleted: 'Ngừng bán',
}
