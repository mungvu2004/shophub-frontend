import { lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'

import { AppShellRoutes } from '@/app/routes/appShell.routes'
import { AuthRoutes } from '@/app/routes/auth.routes'
import { NotFoundRoute } from '@/app/routes/notFound.route'
import { PageLoader } from '@/app/routes/pageLoader'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'

const OrderDetailPage = lazy(() =>
  import('@/pages/orders/OrderDetailPage').then((module) => ({
    default: module.OrderDetailPage,
  })),
)

export function AppRouter() {
  const location = useLocation()
  const backgroundLocation = (location.state as { backgroundLocation?: typeof location } | null)?.backgroundLocation

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        {AuthRoutes()}
        {AppShellRoutes()}
        {NotFoundRoute()}
      </Routes>

      {backgroundLocation ? (
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              path="orders/:id"
              element={
                <PageLoader>
                  <OrderDetailPage />
                </PageLoader>
              }
            />
          </Route>
        </Routes>
      ) : null}
    </>
  )
}
