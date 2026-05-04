import { useState, useCallback, useMemo } from 'react'
import { toast } from '@/components/ui/toast'
import { MESSAGES } from '@/constants/messages'

export type ActionType = 'creating' | 'updating' | 'deleting' | 'status-changing' | null

type ActionKind = Exclude<ActionType, null>

type ActionMessageSet = {
  processing: string
  success: string
  error: string
}

type ActionMessageOverride = Partial<ActionMessageSet>

type ActionMessagesMap = Record<ActionKind, ActionMessageSet>

interface CRUDCallbacks<T = unknown> {
  onSuccess?: (data: T, action: ActionKind) => void
  onError?: (error: unknown, action: ActionKind) => void
}

const DEFAULT_ACTION_MESSAGES: ActionMessagesMap = {
  creating: {
    processing: MESSAGES.PROCESSING.CREATE,
    success: MESSAGES.SUCCESS.CREATE,
    error: MESSAGES.ERROR.CREATE,
  },
  updating: {
    processing: MESSAGES.PROCESSING.UPDATE,
    success: MESSAGES.SUCCESS.UPDATE,
    error: MESSAGES.ERROR.UPDATE,
  },
  deleting: {
    processing: MESSAGES.PROCESSING.DELETE,
    success: MESSAGES.SUCCESS.DELETE,
    error: MESSAGES.ERROR.DELETE,
  },
  'status-changing': {
    processing: MESSAGES.PROCESSING.STATUS_CHANGE,
    success: MESSAGES.SUCCESS.STATUS_CHANGE,
    error: MESSAGES.ERROR.STATUS_CHANGE,
  },
}

function buildActionMessages(
  action: ActionKind,
  override?: ActionMessageOverride,
): ActionMessageSet {
  const defaults = DEFAULT_ACTION_MESSAGES[action]

  return {
    processing: override?.processing ?? defaults.processing ?? MESSAGES.PROCESSING.GENERAL,
    success: override?.success ?? defaults.success,
    error: override?.error ?? defaults.error,
  }
}

export function useCRUDActions<T = unknown>() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionType, setActionType] = useState<ActionType>(null)

  const executeAction = useCallback(
    async (
      action: ActionKind,
      apiCall: () => Promise<T>,
      callbacks?: CRUDCallbacks<T>,
      messagesOverride?: ActionMessageOverride,
    ) => {
      setIsProcessing(true)
      setActionType(action)

      const messages = buildActionMessages(action, messagesOverride)
      const loadingToastId = toast.loading(messages.processing)

      try {
        const result = await apiCall()
        toast.dismiss(loadingToastId)
        toast.success(messages.success)
        callbacks?.onSuccess?.(result, action)
        return result
      } catch (error) {
        toast.dismiss(loadingToastId)
        toast.error(messages.error)
        callbacks?.onError?.(error, action)
        throw error
      } finally {
        setIsProcessing(false)
        setActionType(null)
      }
    },
    [],
  )

  const handleCreate = useCallback(
    (apiCall: () => Promise<T>, callbacks?: CRUDCallbacks<T>, messagesOverride?: ActionMessageOverride) =>
      executeAction('creating', apiCall, callbacks, messagesOverride),
    [executeAction],
  )

  const handleUpdate = useCallback(
    (apiCall: () => Promise<T>, callbacks?: CRUDCallbacks<T>, messagesOverride?: ActionMessageOverride) =>
      executeAction('updating', apiCall, callbacks, messagesOverride),
    [executeAction],
  )

  const handleDelete = useCallback(
    (apiCall: () => Promise<T>, callbacks?: CRUDCallbacks<T>, messagesOverride?: ActionMessageOverride) =>
      executeAction('deleting', apiCall, callbacks, messagesOverride),
    [executeAction],
  )

  const handleStatusChange = useCallback(
    (apiCall: () => Promise<T>, callbacks?: CRUDCallbacks<T>, messagesOverride?: ActionMessageOverride) =>
      executeAction('status-changing', apiCall, callbacks, messagesOverride),
    [executeAction],
  )

  return useMemo(
    () => ({
      isProcessing,
      actionType,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleStatusChange,
    }),
    [isProcessing, actionType, handleCreate, handleUpdate, handleDelete, handleStatusChange],
  )
}
