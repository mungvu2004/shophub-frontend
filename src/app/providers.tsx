import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Toaster } from '@/components/ui/toast'
import { useProductStore } from '@/stores/productStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

/**
 * Initialize global data on app startup
 */
function AppInitializer({ children }: PropsWithChildren) {
  useEffect(() => {
    // Preload critical products when app starts
    const preloadProducts = async () => {
      const { preloadCriticalProducts, isPreloaded } = useProductStore.getState()
      if (!isPreloaded) {
        await preloadCriticalProducts()
      }
    }

    preloadProducts()
  }, [])

  return <>{children}</>
}

export function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInitializer>
        <BrowserRouter>{children}</BrowserRouter>
      </AppInitializer>
      <Toaster />
      {import.meta.env.DEV ? (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      ) : null}
    </QueryClientProvider>
  )
}
