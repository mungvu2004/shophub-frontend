import { Routes } from 'react-router-dom'

import { AppShellRoutes } from '@/app/routes/appShell.routes'
import { AuthRoutes } from '@/app/routes/auth.routes'
import { NotFoundRoute } from '@/app/routes/notFound.route'

export function AppRouter() {
  return (
    <Routes>
      {AuthRoutes()}
      {AppShellRoutes()}
      {NotFoundRoute()}
    </Routes>
  )
}
