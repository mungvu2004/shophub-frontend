import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'

import { NavbarAccountMenu } from '@/components/layout/navbar/NavbarAccountMenu'
import { NavbarDatePicker } from '@/components/layout/navbar/NavbarDatePicker'
import { NavbarNotificationsMenu } from '@/components/layout/navbar/NavbarNotificationsMenu'
import { resolvePageTitle } from '@/components/layout/navbar/navbarPageTitle.logic'
import { NavbarTitleSection } from '@/components/layout/navbar/NavbarTitleSection'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { useUIStore } from '@/stores/uiStore'

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()

  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const selectedDate = useUIStore((state) => state.selectedDate)
  const setSelectedDate = useUIStore((state) => state.setSelectedDate)

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const displayName = user?.fullName?.trim() || 'Seller'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const pageTitle = useMemo(
    () => resolvePageTitle(location.pathname),
    [location.pathname],
  )
  const isPlatformComparisonPage = location.pathname === '/revenue/platform-comparison'
  const isRevenueMlForecastPage = location.pathname === '/revenue/ml-forecast'

  return (
    <header
      className={cn(
        'border-b border-secondary-200 bg-white/90 px-4 py-3 backdrop-blur xl:px-8',
        isRevenueMlForecastPage ? 'relative z-10' : 'sticky top-0 z-30',
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <NavbarTitleSection
          pageTitle={pageTitle}
          selectedDate={selectedDate}
          toggleSidebar={toggleSidebar}
          showDateBadge={!isPlatformComparisonPage}
        />

        <div className="flex items-center gap-2">
          {!isPlatformComparisonPage ? (
            <>
              <NavbarDatePicker selectedDate={selectedDate} onDateSelect={setSelectedDate} />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                className="border border-slate-200 hover:bg-slate-50"
                aria-label="Refresh data"
              >
                <RefreshCw className="size-[18px]" />
              </Button>
            </>
          ) : null}

          <NavbarNotificationsMenu />

          <NavbarAccountMenu
            displayName={displayName}
            onOpenSettings={() => navigate('/settings/profile')}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  )
}
