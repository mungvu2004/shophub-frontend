import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

/**
 * Hook for managing back navigation with history tracking
 * 
 * Usage in source page:
 * - NavigateTo `/products/123?from=/dashboard`
 * 
 * Usage in detail page:
 * - const handleBack = useBackNavigation()
 * - onClick={handleBack}
 * 
 * If no 'from' param exists, defaults to browser back or fallback URL
 */
export function useBackNavigation(fallbackUrl = '/dashboard') {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleBack = useCallback(() => {
    const fromUrl = searchParams.get('from')

    if (fromUrl) {
      // Navigate to the URL we came from
      navigate(fromUrl)
    } else {
      // Try browser back, or fallback to dashboard
      if (window.history.length > 1) {
        navigate(-1)
      } else {
        navigate(fallbackUrl)
      }
    }
  }, [navigate, searchParams, fallbackUrl])

  return handleBack
}

/**
 * Utility function to append 'from' parameter to a URL
 * 
 * Usage when navigating TO a detail page:
 * navigate(appendFromParam(`/products/${id}`))
 * 
 * Example:
 * From: /dashboard/kpi-overview
 * To: /products/123
 * Result: /products/123?from=/dashboard/kpi-overview
 */
export function appendFromParam(targetUrl: string, fromUrl?: string): string {
  const source = fromUrl || window.location.pathname + window.location.search
  
  // Parse existing params
  const url = new URL(targetUrl, window.location.origin)
  
  // Only add 'from' if it doesn't exist
  if (!url.searchParams.has('from')) {
    url.searchParams.set('from', source)
  }
  
  // Return relative path
  return url.pathname + url.search
}

/**
 * Get current location for passing as 'from' parameter
 */
export function getCurrentLocationPath(): string {
  return window.location.pathname + window.location.search
}
