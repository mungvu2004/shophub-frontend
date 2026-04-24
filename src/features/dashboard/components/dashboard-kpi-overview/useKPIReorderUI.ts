import { useState } from 'react'
import type { MetricCardData } from '@/features/dashboard/logic/dashboardKpiOverview.types'

export function useKPIReorderUI(
  metrics: Array<MetricCardData & { isPlaceholder?: boolean }>,
  onReorder?: (newMetrics: MetricCardData[]) => void
) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [targetId, setTargetId] = useState<string | null>(null)

  const handleDragStart = (id: string) => {
    setDraggedId(id)
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (id !== draggedId) {
      setTargetId(id)
    }
  }

  const handleDragEnd = () => {
    if (draggedId && targetId && draggedId !== targetId) {
      const oldIndex = metrics.findIndex((m) => m.id === draggedId)
      const newIndex = metrics.findIndex((m) => m.id === targetId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const newMetrics = [...metrics]
        const [removed] = newMetrics.splice(oldIndex, 1)
        newMetrics.splice(newIndex, 0, removed)
        onReorder?.(newMetrics)
      }
    }
    setDraggedId(null)
    setTargetId(null)
  }

  return {
    draggedId,
    targetId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  }
}
