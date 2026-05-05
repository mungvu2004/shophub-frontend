import { Badge } from '@/components/ui/badge'
import { getStatusColor } from '@/constants/statusColors'

interface RevenueStatusBadgeProps {
  status: string
  label?: string
}

export function RevenueStatusBadge({ status, label }: RevenueStatusBadgeProps) {
  const colors = getStatusColor(status)
  const displayLabel = label || status

  return (
    <Badge
      variant="outline"
      className={`${colors.bg} ${colors.text} ${colors.border} border`}
    >
      <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${colors.dot}`} />
      {displayLabel}
    </Badge>
  )
}
