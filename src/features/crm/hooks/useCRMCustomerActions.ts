import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { type ActionType } from '@/features/shared/hooks/useCRUDActions'
import { crmCustomerProfilesService } from '@/features/crm/services/crmCustomerProfilesService'
import { useCRMEntityActions } from '@/features/crm/hooks/useCRMEntityActions'
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
  processingCustomerId: string | null
  handleCreate: (payload: CRMCustomerCreatePayload) => Promise<CRMCustomerProfileDetail | undefined>
  handleUpdate: (id: string, payload: CRMCustomerUpdatePayload) => Promise<CRMCustomerProfileDetail | undefined>
  handleDelete: (id: string) => Promise<{ deletedId: string } | undefined>
  handleStatusChange: (id: string, segment: CRMCustomerSegmentKey) => Promise<CRMCustomerProfileDetail | undefined>
  handleSegmentChange: (id: string, segment: CRMCustomerSegmentKey) => Promise<CRMCustomerProfileDetail | undefined>
}

export function useCRMCustomerActions(
  callbacks?: UseCRMCustomerActionsCallbacks,
): UseCRMCustomerActionsReturn {
  const queryClient = useQueryClient()

  const invalidateCustomers = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['crm', 'customer-profiles'] })
  }, [queryClient])

  const actions = useCRMEntityActions<
    CRMCustomerProfileDetail,
    [CRMCustomerCreatePayload],
    CRMCustomerProfileDetail,
    [string, CRMCustomerUpdatePayload],
    { deletedId: string },
    [string],
    CRMCustomerProfileDetail,
    [string, CRMCustomerSegmentKey]
  >({
    create: {
      action: (payload) => crmCustomerProfilesService.createCustomer(payload),
      messages: {
        processing: MESSAGES.CRM.CUSTOMER.PROCESSING.CREATE,
        success: MESSAGES.CRM.CUSTOMER.SUCCESS.CREATE,
        error: MESSAGES.CRM.CUSTOMER.ERROR.CREATE,
      },
    },
    update: {
      action: (id, payload) => crmCustomerProfilesService.updateCustomer(id, payload),
      messages: {
        processing: MESSAGES.CRM.CUSTOMER.PROCESSING.UPDATE,
        success: MESSAGES.CRM.CUSTOMER.SUCCESS.UPDATE,
        error: MESSAGES.CRM.CUSTOMER.ERROR.UPDATE,
      },
    },
    delete: {
      action: (id) => crmCustomerProfilesService.deleteCustomer(id),
      messages: {
        processing: MESSAGES.CRM.CUSTOMER.PROCESSING.DELETE,
        success: MESSAGES.CRM.CUSTOMER.SUCCESS.DELETE,
        error: MESSAGES.CRM.CUSTOMER.ERROR.DELETE,
      },
    },
    statusChange: {
      action: (id, segment) => crmCustomerProfilesService.changeCustomerSegment(id, segment),
      messages: {
        processing: MESSAGES.CRM.CUSTOMER.PROCESSING.STATUS_CHANGE,
        success: MESSAGES.CRM.CUSTOMER.SUCCESS.STATUS_CHANGE,
        error: MESSAGES.CRM.CUSTOMER.ERROR.STATUS_CHANGE,
      },
    },
    callbacks: {
      onSuccess: () => {
        invalidateCustomers()
        callbacks?.onSuccess?.()
      },
    },
  })

  const processingCustomerId = null

  const handleSegmentChange = actions.handleStatusChange

  return useMemo(
    () => ({
      isProcessing: actions.isProcessing,
      actionType: actions.actionType,
      processingCustomerId,
      handleCreate: actions.handleCreate,
      handleUpdate: actions.handleUpdate,
      handleDelete: actions.handleDelete,
      handleStatusChange: actions.handleStatusChange,
      handleSegmentChange,
    }),
    [actions, handleSegmentChange, processingCustomerId],
  )
}
