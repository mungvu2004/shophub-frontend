import { lazy } from 'react'
import { Route } from 'react-router-dom'

import { PageLoader } from '@/app/routes/pageLoader'

const NotFoundPage = lazy(() =>
  import('@/pages/system/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  })),
)

export function NotFoundRoute() {
  return (
    <Route
      path="*"
      element={
        <PageLoader>
          <NotFoundPage />
        </PageLoader>
      }
    />
  )
}
