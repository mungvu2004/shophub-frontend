import { useMemo, useCallback } from 'react'
import { useCRUDActions } from '@/features/shared/hooks/useCRUDActions'
import { MESSAGES } from '@/constants/messages'
import { revenueSummaryService } from '@/features/revenue/services/revenueSummaryService'
import { revenuePlatformComparisonService } from '@/features/revenue/services/revenuePlatformComparisonService'
import { revenueMlForecastService } from '@/features/revenue/services/revenueMlForecastService'
import type { 
  RevenueSummaryReportResponse,
  RevenuePlatformComparisonResponse,
  RevenueMlForecastScenarioInput,
  RevenueMlForecastComparisonScenario,
} from '@/types/revenue.types'

interface UseRevenueActionsOptions {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export function useRevenueSummaryActions(options: UseRevenueActionsOptions = {}) {
  const { onSuccess, onError } = options
  const crud = useCRUDActions<RevenueSummaryReportResponse>()

  const handleRefresh = useCallback(
    async (month: string) => {
      await crud.handleUpdate(
        () => revenueSummaryService.getSummaryReport(month),
        {
          onSuccess: () => {
            onSuccess?.()
          },
          onError: (error) => {
            onError?.(error)
          },
        },
        {
          processing: MESSAGES.REVENUE.SUMMARY_REPORT.PROCESSING.LOAD,
          success: MESSAGES.REVENUE.SUMMARY_REPORT.SUCCESS.REFRESH,
          error: MESSAGES.REVENUE.SUMMARY_REPORT.ERROR.LOAD,
        }
      )
    },
    [crud, onSuccess, onError]
  )

  const handleExport = useCallback(
    async () => {
      await crud.handleCreate(
        async () => {
          window.print()
          return {} as RevenueSummaryReportResponse
        },
        {
          onSuccess: () => {
            onSuccess?.()
          },
          onError: (error) => {
            onError?.(error)
          },
        },
        {
          processing: MESSAGES.REVENUE.SUMMARY_REPORT.PROCESSING.EXPORT,
          success: MESSAGES.REVENUE.SUMMARY_REPORT.SUCCESS.EXPORT,
          error: MESSAGES.REVENUE.SUMMARY_REPORT.ERROR.EXPORT,
        }
      )
    },
    [crud, onSuccess, onError]
  )

  return useMemo(
    () => ({
      isProcessing: crud.isProcessing,
      actionType: crud.actionType,
      isRefreshing: crud.actionType === 'updating',
      isExporting: crud.actionType === 'creating',
      handleRefresh,
      handleExport,
      messages: {
        refresh: MESSAGES.REVENUE.SUMMARY_REPORT.BUTTON.REFRESH,
        refreshLoading: MESSAGES.REVENUE.SUMMARY_REPORT.BUTTON.REFRESH_LOADING,
        export: MESSAGES.REVENUE.SUMMARY_REPORT.BUTTON.EXPORT,
        exportLoading: MESSAGES.REVENUE.SUMMARY_REPORT.BUTTON.EXPORT_LOADING,
      },
    }),
    [crud.isProcessing, crud.actionType, handleRefresh, handleExport]
  )
}

export function useRevenuePlatformActions(options: UseRevenueActionsOptions = {}) {
  const { onSuccess, onError } = options
  const crud = useCRUDActions<RevenuePlatformComparisonResponse>()

  const handleSync = useCallback(
    async (month: string) => {
      await crud.handleUpdate(
        () => revenuePlatformComparisonService.getPlatformComparison(month),
        {
          onSuccess: () => {
            onSuccess?.()
          },
          onError: (error) => {
            onError?.(error)
          },
        },
        {
          processing: MESSAGES.REVENUE.PLATFORM_COMPARISON.PROCESSING.SYNC,
          success: MESSAGES.REVENUE.PLATFORM_COMPARISON.SUCCESS.SYNC,
          error: MESSAGES.REVENUE.PLATFORM_COMPARISON.ERROR.SYNC,
        }
      )
    },
    [crud, onSuccess, onError]
  )

  const handleExport = useCallback(
    async () => {
      await crud.handleCreate(
        async () => {
          return {} as RevenuePlatformComparisonResponse
        },
        {
          onSuccess: () => {
            onSuccess?.()
          },
          onError: (error) => {
            onError?.(error)
          },
        },
        {
          processing: MESSAGES.REVENUE.PLATFORM_COMPARISON.PROCESSING.CREATE,
          success: MESSAGES.REVENUE.PLATFORM_COMPARISON.SUCCESS.EXPORT,
          error: MESSAGES.REVENUE.PLATFORM_COMPARISON.ERROR.CREATE,
        }
      )
    },
    [crud, onSuccess, onError]
  )

  return useMemo(
    () => ({
      isProcessing: crud.isProcessing,
      actionType: crud.actionType,
      isSyncing: crud.actionType === 'updating',
      isExporting: crud.actionType === 'creating',
      handleSync,
      handleExport,
      messages: {
        sync: MESSAGES.REVENUE.PLATFORM_COMPARISON.BUTTON.SYNC,
        syncLoading: MESSAGES.REVENUE.PLATFORM_COMPARISON.BUTTON.SYNC_LOADING,
        export: MESSAGES.REVENUE.PLATFORM_COMPARISON.BUTTON.EXPORT,
        exportLoading: MESSAGES.REVENUE.PLATFORM_COMPARISON.BUTTON.EXPORT_LOADING,
      },
    }),
    [crud.isProcessing, crud.actionType, handleSync, handleExport]
  )
}

export function useRevenueForecastActions(options: UseRevenueActionsOptions = {}) {
  const { onSuccess, onError } = options
  const crud = useCRUDActions<RevenueMlForecastComparisonScenario>()

  const handleSimulate = useCallback(
    async (input: RevenueMlForecastScenarioInput) => {
      await crud.handleCreate(
        () => revenueMlForecastService.simulateScenario(input),
        {
          onSuccess: () => {
            onSuccess?.()
          },
          onError: (error) => {
            onError?.(error)
          },
        },
        {
          processing: MESSAGES.REVENUE.ML_FORECAST.PROCESSING.SIMULATE,
          success: MESSAGES.REVENUE.ML_FORECAST.SUCCESS.SIMULATE,
          error: MESSAGES.REVENUE.ML_FORECAST.ERROR.SIMULATE,
        }
      )
    },
    [crud, onSuccess, onError]
  )

  const handleDeleteScenario = useCallback(
    async (scenarioId: string) => {
      await crud.handleDelete(
        async () => {
          // TODO: Implement actual delete API call with scenarioId
          console.log('Deleting scenario:', scenarioId)
          return {} as RevenueMlForecastComparisonScenario
        },
        {
          onSuccess: () => {
            onSuccess?.()
          },
          onError: (error) => {
            onError?.(error)
          },
        },
        {
          processing: MESSAGES.REVENUE.ML_FORECAST.PROCESSING.DELETE_SCENARIO,
          success: MESSAGES.REVENUE.ML_FORECAST.SUCCESS.DELETE_SCENARIO,
          error: MESSAGES.REVENUE.ML_FORECAST.ERROR.DELETE_SCENARIO,
        }
      )
    },
    [crud, onSuccess, onError]
  )

  const handleApplyCampaign = useCallback(
    async () => {
      await crud.handleUpdate(
        async () => {
          return {} as RevenueMlForecastComparisonScenario
        },
        {
          onSuccess: () => {
            onSuccess?.()
          },
          onError: (error) => {
            onError?.(error)
          },
        },
        {
          processing: MESSAGES.REVENUE.ML_FORECAST.PROCESSING.APPLY_CAMPAIGN,
          success: MESSAGES.REVENUE.ML_FORECAST.SUCCESS.APPLY_CAMPAIGN,
          error: MESSAGES.REVENUE.ML_FORECAST.ERROR.APPLY_CAMPAIGN,
        }
      )
    },
    [crud, onSuccess, onError]
  )

  return useMemo(
    () => ({
      isProcessing: crud.isProcessing,
      actionType: crud.actionType,
      isSimulating: crud.actionType === 'creating',
      isDeleting: crud.actionType === 'deleting',
      isApplying: crud.actionType === 'updating',
      handleSimulate,
      handleDeleteScenario,
      handleApplyCampaign,
      messages: {
        simulate: MESSAGES.REVENUE.ML_FORECAST.BUTTON.SIMULATE,
        simulateLoading: MESSAGES.REVENUE.ML_FORECAST.BUTTON.SIMULATE_LOADING,
        delete: MESSAGES.REVENUE.ML_FORECAST.BUTTON.DELETE,
        deleteLoading: MESSAGES.REVENUE.ML_FORECAST.BUTTON.DELETE_LOADING,
        applyCampaign: MESSAGES.REVENUE.ML_FORECAST.BUTTON.APPLY_CAMPAIGN,
        applyLoading: MESSAGES.REVENUE.ML_FORECAST.BUTTON.APPLY_LOADING,
      },
    }),
    [crud.isProcessing, crud.actionType, handleSimulate, handleDeleteScenario, handleApplyCampaign]
  )
}
