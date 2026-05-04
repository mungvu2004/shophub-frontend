import { useCallback, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { dashboardKpiCrudService } from '@/features/dashboard/services/dashboardKpiCrudService'
import type {
  DashboardKpiCrudPayload,
  DashboardKpiCrudStatus,
} from '@/features/dashboard/logic/dashboardKpiCrud.types'
import { useCRUDActions } from '@/features/shared/hooks/useCRUDActions'

const queryKey = ['dashboard', 'kpi-overview', 'configs'] as const

const nextStatusMap: Record<DashboardKpiCrudStatus, DashboardKpiCrudStatus> = {
  success: 'processing',
  processing: 'cancelled',
  cancelled: 'error',
  error: 'success',
}

export function useDashboardKpiOverviewActions() {
  const queryClient = useQueryClient()
  const crud = useCRUDActions()
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null)

  const query = useQuery({
    queryKey,
    queryFn: () => dashboardKpiCrudService.getConfigs(),
    staleTime: 30 * 1000,
  })

  const invalidateConfigs = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey })
  }, [queryClient])

  const handleCreate = useCallback(
    async (payload: DashboardKpiCrudPayload) => {
      setActiveRecordId(null)
      await crud.handleCreate(
        () => dashboardKpiCrudService.createConfig(payload),
        {
          onSuccess: async () => {
            await invalidateConfigs()
          },
        },
      )
    },
    [crud, invalidateConfigs],
  )

  const handleUpdate = useCallback(
    async (id: string, payload: DashboardKpiCrudPayload) => {
      setActiveRecordId(id)
      try {
        await crud.handleUpdate(
          () => dashboardKpiCrudService.updateConfig(id, payload),
          {
            onSuccess: async () => {
              await invalidateConfigs()
            },
          },
        )
      } finally {
        setActiveRecordId(null)
      }
    },
    [crud, invalidateConfigs],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      setActiveRecordId(id)
      try {
        await crud.handleDelete(
          () => dashboardKpiCrudService.deleteConfig(id),
          {
            onSuccess: async () => {
              await invalidateConfigs()
            },
          },
        )
      } finally {
        setActiveRecordId(null)
      }
    },
    [crud, invalidateConfigs],
  )

  const handleStatusChange = useCallback(
    async (id: string, currentStatus: DashboardKpiCrudStatus) => {
      setActiveRecordId(id)
      try {
        await crud.handleStatusChange(
          () => dashboardKpiCrudService.updateStatus(id, nextStatusMap[currentStatus]),
          {
            onSuccess: async () => {
              await invalidateConfigs()
            },
          },
        )
      } finally {
        setActiveRecordId(null)
      }
    },
    [crud, invalidateConfigs],
  )

  return useMemo(
    () => ({
      items: query.data ?? [],
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isError: query.isError,
      refetch: query.refetch,
      isProcessing: crud.isProcessing,
      actionType: crud.actionType,
      activeRecordId,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleStatusChange,
    }),
    [
      query.data,
      query.isLoading,
      query.isFetching,
      query.isError,
      query.refetch,
      crud.isProcessing,
      crud.actionType,
      activeRecordId,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleStatusChange,
    ],
  )
}
