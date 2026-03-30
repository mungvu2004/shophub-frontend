import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { PageSkeleton } from '@/components/ui/PageSkeleton'

import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function AppShell() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-foreground lg:pl-60">
      <Sidebar />
      <div className="min-h-screen">
        <Navbar />
        <main className="p-8">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
