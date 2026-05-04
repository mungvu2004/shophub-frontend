/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { dashboardRevenueChartsCrudService } from '@/features/dashboard/services/dashboardRevenueChartsCrudService'
import type { RevenueTimelineEvent } from '@/features/dashboard/logic/dashboardRevenueCharts.types'
import { useCRUDActions } from '@/features/shared/hooks/useCRUDActions'

export function useDashboardRevenueChartsActions() {
  const queryClient = useQueryClient()
  const crud = useCRUDActions<RevenueTimelineEvent>()

  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ['dashboard-revenue-events'],
    queryFn: () => dashboardRevenueChartsCrudService.getEvents(),
  })

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard-revenue-charts'] })
    refetch()
  }, [queryClient, refetch])

  const handleCreate = useCallback(
    async (payload: Omit<RevenueTimelineEvent, 'id'>) => {
      await crud.handleCreate(
        () => dashboardRevenueChartsCrudService.createEvent(payload),
        { onSuccess: refreshData }
      )
    },
    [crud, refreshData]
  )

  const handleUpdate = useCallback(
    async (id: string, payload: Partial<RevenueTimelineEvent>) => {
      await crud.handleUpdate(
        () => dashboardRevenueChartsCrudService.updateEvent(id, payload),
        { onSuccess: refreshData }
      )
    },
    [crud, refreshData]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      // Need to cast to any since handleDelete expects a Promise of RevenueTimelineEvent
      await crud.handleDelete(
        () => dashboardRevenueChartsCrudService.deleteEvent(id) as any,
        { onSuccess: refreshData }
      )
    },
    [crud, refreshData]
  )

  return {
    events,
    isLoading,
    isProcessing: crud.isProcessing,
    actionType: crud.actionType,
    handleCreate,
    handleUpdate,
    handleDelete,
  }
}
