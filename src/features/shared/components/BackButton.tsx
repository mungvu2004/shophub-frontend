import { ArrowLeft } from 'lucide-react'
import { useBackNavigation } from '@/features/shared/hooks/useBackNavigation'

type BackButtonProps = {
  fallbackUrl?: string
  label?: string
  className?: string
}

/**
 * Reusable back button component with smart navigation
 * 
 * If 'from' query param exists, navigate back to that URL
 * Otherwise use browser back or fallback to specified URL
 * 
 * Usage:
 * <BackButton fallbackUrl="/products" label="Quay lại" />
 */
export function BackButton({ fallbackUrl = '/dashboard', label = 'Quay lại', className = '' }: BackButtonProps) {
  const handleBack = useBackNavigation(fallbackUrl)

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )
}

/**
 * Back icon button (compact version)
 */
export function BackIconButton({ fallbackUrl = '/dashboard', className = '' }: Omit<BackButtonProps, 'label'>) {
  const handleBack = useBackNavigation(fallbackUrl)

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors ${className}`}
      title="Quay lại"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  )
}
