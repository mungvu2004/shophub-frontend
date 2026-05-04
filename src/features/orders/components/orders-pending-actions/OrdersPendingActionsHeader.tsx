/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'
import { ClockAlert } from 'lucide-react'

type OrdersPendingActionsHeaderProps = {
  title: string
  description: string
  isRefreshing: boolean
}

export function OrdersPendingActionsHeader({ title, description, isRefreshing }: OrdersPendingActionsHeaderProps) {
  return (
    <ThemedPageHeader
      title={title}
      subtitle={
        <span className="flex items-center gap-2">
          <span>{description}</span>
          {isRefreshing ? <span className="text-[11px] font-bold text-amber-600 animate-pulse">Đang làm mới...</span> : null}
        </span> as any
      }
      theme="orders"
      badge={{ text: 'Pending Actions', icon: <ClockAlert className="size-3.5" /> }}
    />
  )
}
