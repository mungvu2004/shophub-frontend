import { useCallback, useMemo } from 'react'

import { useCRUDActions, type ActionType } from '@/features/shared/hooks/useCRUDActions'

type AsyncFn<TResult, TArgs extends unknown[]> = (...args: TArgs) => Promise<TResult>

type ActionMessages = {
  processing: string
  success: string
  error: string
}

type ActionCallbacks = {
  onSuccess?: () => void
}

type CRMEntityActionConfig<
  TCreateResult,
  TCreateArgs extends unknown[],
  TUpdateResult,
  TUpdateArgs extends unknown[],
  TDeleteResult,
  TDeleteArgs extends unknown[],
  TStatusResult,
  TStatusArgs extends unknown[],
> = {
  create?: {
    action: AsyncFn<TCreateResult, TCreateArgs>
    messages: ActionMessages
  }
  update?: {
    action: AsyncFn<TUpdateResult, TUpdateArgs>
    messages: ActionMessages
  }
  delete?: {
    action: AsyncFn<TDeleteResult, TDeleteArgs>
    messages: ActionMessages
  }
  statusChange?: {
    action: AsyncFn<TStatusResult, TStatusArgs>
    messages: ActionMessages
  }
  callbacks?: ActionCallbacks
}

type StandardActionHandler<TResult, TArgs extends unknown[]> = (...args: TArgs) => Promise<TResult | undefined>

export type CRMStandardActions<
  TCreateResult,
  TCreateArgs extends unknown[],
  TUpdateResult,
  TUpdateArgs extends unknown[],
  TDeleteResult,
  TDeleteArgs extends unknown[],
  TStatusResult,
  TStatusArgs extends unknown[],
> = {
  isProcessing: boolean
  actionType: ActionType
  handleCreate: StandardActionHandler<TCreateResult, TCreateArgs>
  handleUpdate: StandardActionHandler<TUpdateResult, TUpdateArgs>
  handleDelete: StandardActionHandler<TDeleteResult, TDeleteArgs>
  handleStatusChange: StandardActionHandler<TStatusResult, TStatusArgs>
}

type EmptyArgs = []

async function unsupportedAction<TResult>(): Promise<TResult | undefined> {
  return undefined
}

export function useCRMEntityActions<
  TCreateResult = unknown,
  TCreateArgs extends unknown[] = EmptyArgs,
  TUpdateResult = unknown,
  TUpdateArgs extends unknown[] = EmptyArgs,
  TDeleteResult = unknown,
  TDeleteArgs extends unknown[] = EmptyArgs,
  TStatusResult = unknown,
  TStatusArgs extends unknown[] = EmptyArgs,
>(
  config: CRMEntityActionConfig<
    TCreateResult,
    TCreateArgs,
    TUpdateResult,
    TUpdateArgs,
    TDeleteResult,
    TDeleteArgs,
    TStatusResult,
    TStatusArgs
  >,
): CRMStandardActions<
  TCreateResult,
  TCreateArgs,
  TUpdateResult,
  TUpdateArgs,
  TDeleteResult,
  TDeleteArgs,
  TStatusResult,
  TStatusArgs
> {
  const crud = useCRUDActions<unknown>()

  const handleCreate = useCallback<StandardActionHandler<TCreateResult, TCreateArgs>>(
    async (...args) => {
      if (!config.create) return unsupportedAction<TCreateResult>()

      const result = await crud.handleCreate(
        () => config.create!.action(...args),
        {
          onSuccess: () => {
            config.callbacks?.onSuccess?.()
          },
        },
        config.create.messages,
      )

      return result as TCreateResult | undefined
    },
    [crud, config],
  )

  const handleUpdate = useCallback<StandardActionHandler<TUpdateResult, TUpdateArgs>>(
    async (...args) => {
      if (!config.update) return unsupportedAction<TUpdateResult>()

      const result = await crud.handleUpdate(
        () => config.update!.action(...args),
        {
          onSuccess: () => {
            config.callbacks?.onSuccess?.()
          },
        },
        config.update.messages,
      )

      return result as TUpdateResult | undefined
    },
    [crud, config],
  )

  const handleDelete = useCallback<StandardActionHandler<TDeleteResult, TDeleteArgs>>(
    async (...args) => {
      if (!config.delete) return unsupportedAction<TDeleteResult>()

      const result = await crud.handleDelete(
        () => config.delete!.action(...args),
        {
          onSuccess: () => {
            config.callbacks?.onSuccess?.()
          },
        },
        config.delete.messages,
      )

      return result as TDeleteResult | undefined
    },
    [crud, config],
  )

  const handleStatusChange = useCallback<StandardActionHandler<TStatusResult, TStatusArgs>>(
    async (...args) => {
      if (!config.statusChange) return unsupportedAction<TStatusResult>()

      const result = await crud.handleStatusChange(
        () => config.statusChange!.action(...args),
        {
          onSuccess: () => {
            config.callbacks?.onSuccess?.()
          },
        },
        config.statusChange.messages,
      )

      return result as TStatusResult | undefined
    },
    [crud, config],
  )

  return useMemo(
    () => ({
      isProcessing: crud.isProcessing,
      actionType: crud.actionType,
      handleCreate,
      handleUpdate,
      handleDelete,
      handleStatusChange,
    }),
    [crud.isProcessing, crud.actionType, handleCreate, handleUpdate, handleDelete, handleStatusChange],
  )
}