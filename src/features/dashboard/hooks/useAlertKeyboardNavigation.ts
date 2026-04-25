import { useState, useEffect, useCallback } from 'react'

interface UseAlertKeyboardNavigationProps {
  alertIds: string[]
  onAssign: (alertId: string) => void
  onDismiss: (alertId: string) => void
  onAction: (alertId: string) => void
}

export function useAlertKeyboardNavigation({
  alertIds,
  onAssign,
  onDismiss,
  onAction
}: UseAlertKeyboardNavigationProps) {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

    switch (e.key.toLowerCase()) {
      case 'j':
      case 'arrowdown':
        e.preventDefault()
        setFocusedIndex(prev => (prev < alertIds.length - 1 ? prev + 1 : prev))
        break
      case 'k':
      case 'arrowup':
        e.preventDefault()
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev))
        break
      case 'a':
        if (focusedIndex >= 0 && alertIds[focusedIndex]) {
          e.preventDefault()
          onAssign(alertIds[focusedIndex])
        }
        break
      case 'd':
        if (focusedIndex >= 0 && alertIds[focusedIndex]) {
          e.preventDefault()
          onDismiss(alertIds[focusedIndex])
        }
        break
      case 'enter':
        if (focusedIndex >= 0 && alertIds[focusedIndex]) {
          e.preventDefault()
          onAction(alertIds[focusedIndex])
        }
        break
      case 'escape':
        setFocusedIndex(-1)
        break
    }
  }, [alertIds, focusedIndex, onAssign, onDismiss, onAction])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Clamp index if list shrinks
  const safeIndex = focusedIndex >= alertIds.length ? alertIds.length - 1 : focusedIndex

  return {
    focusedAlertId: safeIndex >= 0 ? alertIds[safeIndex] : null,
    setFocusedIndex
  }
}
