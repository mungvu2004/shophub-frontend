import { lazy } from 'react'
import { Route } from 'react-router-dom'

import { PageLoader } from '@/app/routes/pageLoader'

const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((module) => ({ default: module.LoginPage })),
)

const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPasswordPage').then((module) => ({
    default: module.ForgotPasswordPage,
  })),
)

export function AuthRoutes() {
  return (
    <>
      <Route
        path="/login"
        element={
          <PageLoader>
            <LoginPage />
          </PageLoader>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PageLoader>
            <ForgotPasswordPage />
          </PageLoader>
        }
      />
    </>
  )
}
