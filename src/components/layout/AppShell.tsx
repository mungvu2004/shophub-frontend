import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { AppFooter } from '@/features/footer/components/AppFooter'
import { PageSkeleton } from '@/components/ui/PageSkeleton'

import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div className="min-h-screen bg-secondary-50 text-foreground xl:pl-60">
      <Sidebar />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 p-8">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
        <AppFooter />
      </div>
    </div>
  )
}
