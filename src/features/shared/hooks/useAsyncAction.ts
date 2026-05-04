import { useState, useCallback } from 'react'
import { toast } from '@/components/ui/toast'
import { MESSAGES } from '@/constants/messages'

export type ActionType = 'creating' | 'updating' | 'deleting' | 'status-changing' | null

export function useAsyncAction() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionType, setActionType] = useState<ActionType>(null)

  const runAction = useCallback(
    async <T,>(
      actionFn: () => Promise<T>,
      options: {
        type: ActionType
        successMessage?: string
        errorMessage?: string
        onSuccess?: (data: T) => void
        onError?: (error: unknown) => void
      }
    ) => {
      setIsProcessing(true)
      setActionType(options.type)

      try {
        const result = await actionFn()
        
        let defaultSuccessMsg: string = MESSAGES.SUCCESS.UPDATE
        if (options.type === 'creating') defaultSuccessMsg = MESSAGES.SUCCESS.CREATE
        if (options.type === 'deleting') defaultSuccessMsg = MESSAGES.SUCCESS.DELETE
        if (options.type === 'status-changing') defaultSuccessMsg = MESSAGES.SUCCESS.STATUS_CHANGE

        toast.success(options.successMessage || defaultSuccessMsg)

        if (options.onSuccess) {
          options.onSuccess(result)
        }

        return result
        } catch (error) {
        let defaultErrorMsg: string = MESSAGES.ERROR.UPDATE
        if (options.type === 'creating') defaultErrorMsg = MESSAGES.ERROR.CREATE
        if (options.type === 'deleting') defaultErrorMsg = MESSAGES.ERROR.DELETE
        if (options.type === 'status-changing') defaultErrorMsg = MESSAGES.ERROR.STATUS_CHANGE

        toast.error(options.errorMessage || defaultErrorMsg)
        
        if (options.onError) {
          options.onError(error)
        }
        throw error
      } finally {
        setIsProcessing(false)
        setActionType(null)
      }
    },
    []
  )

  return {
    isProcessing,
    actionType,
    runAction,
  }
}
