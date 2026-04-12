import { useEffect, useMemo, useState } from 'react'

export function useOrdersAllSelection(visibleRowIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => visibleRowIds.includes(id)))
  }, [visibleRowIds])

  const selectedCount = selectedIds.length

  const isAllSelected = useMemo(() => {
    return visibleRowIds.length > 0 && selectedCount === visibleRowIds.length
  }, [selectedCount, visibleRowIds.length])

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
      return
    }

    setSelectedIds(visibleRowIds)
  }

  const toggleOne = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id)
      return [...current, id]
    })
  }

  const clearSelection = () => {
    setSelectedIds([])
  }

  return {
    selectedIds,
    selectedCount,
    isAllSelected,
    toggleAll,
    toggleOne,
    clearSelection,
  }
}
