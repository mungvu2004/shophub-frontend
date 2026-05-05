import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useCRUDActions, type ActionType } from '@/features/shared/hooks/useCRUDActions'
import { crmCustomerProfilesService } from '@/features/crm/services/crmCustomerProfilesService'
import { MESSAGES } from '@/constants/messages'
import type {
  CRMCustomerCreatePayload,
  CRMCustomerProfileDetail,
  CRMCustomerSegmentKey,
  CRMCustomerUpdatePayload,
} from '@/types/crm.types'

interface UseCRMCustomerActionsCallbacks {
  onSuccess?: () => void
}

interface UseCRMCustomerActionsReturn {
  isProcessing: boolean
  actionType: ActionType
  handleCreate: (payload: CRMCustomerCreatePayload) => Promise<CRMCustomerProfileDetail | undefined>
  handleUpdate: (id: string, payload: CRMCustomerUpdatePayload) => Promise<CRMCustomerProfileDetail | undefined>
  handleDelete: (id: string) => Promise<void>
  handleSegmentChange: (id: string, segment: CRMCustomerSegmentKey) => Promise<CRMCustomerProfileDetail | undefined>
}

export function useCRMCustomerActions(
  callbacks?: UseCRMCustomerActionsCallbacks,
): UseCRMCustomerActionsReturn {
  const queryClient = useQueryClient()
  const crud = useCRUDActions<CRMCustomerProfileDetail>()
  const crudDelete = useCRUDActions<{ deletedId: string }>()

  const invalidateCustomers = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['crm', 'customer-profiles'] })
  }, [queryClient])

  const handleCreate = useCallback(
    async (payload: CRMCustomerCreatePayload) => {
      const result = await crud.handleCreate(
        () => crmCustomerProfilesService.createCustomer(payload),
        {
          onSuccess: () => {
            invalidateCustomers()
            callbacks?.onSuccess?.()
          },
        },
        {
          processing: MESSAGES.CRM.CUSTOMER.PROCESSING.CREATE,
          success: MESSAGES.CRM.CUSTOMER.SUCCESS.CREATE,
          error: MESSAGES.CRM.CUSTOMER.ERROR.CREATE,
        },
      )
      return result
    },
    [crud, invalidateCustomers, callbacks],
  )

  const handleUpdate = useCallback(
    async (id: string, payload: CRMCustomerUpdatePayload) => {
      const result = await crud.handleUpdate(
        () => crmCustomerProfilesService.updateCustomer(id, payload),
        {
          onSuccess: () => {
            invalidateCustomers()
            callbacks?.onSuccess?.()
          },
        },
        {
          processing: MESSAGES.CRM.CUSTOMER.PROCESSING.UPDATE,
          success: MESSAGES.CRM.CUSTOMER.SUCCESS.UPDATE,
          error: MESSAGES.CRM.CUSTOMER.ERROR.UPDATE,
        },
      )
      return result
    },
    [crud, invalidateCustomers, callbacks],
  )

  const handleDelete = useCallback(
    async (id: string) => {
      await crudDelete.handleDelete(
        () => crmCustomerProfilesService.deleteCustomer(id),
        {
          onSuccess: () => {
            invalidateCustomers()
            callbacks?.onSuccess?.()
          },
        },
        {
          processing: MESSAGES.CRM.CUSTOMER.PROCESSING.DELETE,
          success: MESSAGES.CRM.CUSTOMER.SUCCESS.DELETE,
          error: MESSAGES.CRM.CUSTOMER.ERROR.DELETE,
        },
      )
    },
    [crudDelete, invalidateCustomers, callbacks],
  )

  const handleSegmentChange = useCallback(
    async (id: string, segment: CRMCustomerSegmentKey) => {
      const result = await crud.handleStatusChange(
        () => crmCustomerProfilesService.changeCustomerSegment(id, segment),
        {
          onSuccess: () => {
            invalidateCustomers()
            callbacks?.onSuccess?.()
          },
        },
        {
          processing: MESSAGES.CRM.CUSTOMER.PROCESSING.STATUS_CHANGE,
          success: MESSAGES.CRM.CUSTOMER.SUCCESS.STATUS_CHANGE,
          error: MESSAGES.CRM.CUSTOMER.ERROR.STATUS_CHANGE,
        },
      )
      return result
    },
    [crud, invalidateCustomers, callbacks],
  )

  const isProcessing = crud.isProcessing || crudDelete.isProcessing
  const actionType: ActionType = crud.actionType ?? crudDelete.actionType

  return useMemo(
    () => ({
      isProcessing,
      actionType,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleSegmentChange,
    }),
    [isProcessing, actionType, handleCreate, handleUpdate, handleDelete, handleSegmentChange],
  )
}
