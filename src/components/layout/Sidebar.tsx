import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, UserCircle2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/uiStore'
import { navItems } from './sidebar/sidebarMenu.config'
import { useSidebarMenuState } from './sidebar/sidebarMenu.logic'

export function Sidebar() {
  const location = useLocation()
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const { expandedSection, isChildActive, isSectionActive, handleToggleSection } =
    useSidebarMenuState(location)

  const closeSidebarOnMobile = () => {
    if (sidebarOpen) {
      toggleSidebar()
    }
  }

  return (
    <>
      <div
        aria-hidden
        className={cn(
          'fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] transition-opacity duration-200 xl:hidden',
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={closeSidebarOnMobile}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-60 border-r border-secondary-800 bg-secondary-900 text-secondary-400 shadow-2xl transition-transform duration-200 ease-out xl:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          <div className="px-6 py-8">
            <Link
              to="/dashboard"
              onClick={closeSidebarOnMobile}
              className="inline-block text-3xl font-bold tracking-tight text-white transition-opacity hover:opacity-90"
              aria-label="Go to Dashboard"
            >
              ShopHub
            </Link>
          </div>

          <nav className="flex-1 space-y-3 px-3 py-2">
            {navItems.map((section) => {
              const SectionIcon = section.icon
              const hasActiveChild = isSectionActive(section.children)
              const isExpanded = expandedSection === section.label

              return (
                <div key={section.label} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleToggleSection(section.label)}
                    aria-expanded={isExpanded}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors',
                      hasActiveChild ? 'text-indigo-300' : 'text-slate-300',
                    )}
                  >
                    <SectionIcon className="size-[18px]" />
                    <span className="flex-1">{section.label}</span>
                    <ChevronDown
                      className={cn('size-4 transition-transform', isExpanded ? 'rotate-180' : '')}
                    />
                  </button>

                  <div
                    className={cn(
                      'space-y-1 overflow-hidden border-l border-slate-800 pl-3 transition-all',
                      isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
                    )}
                  >
                    {section.children.map((child) => {
                      const isActive = isChildActive(child.to)
                      const ChildIcon = child.icon

                      return (
                        <Link
                          key={child.to}
                          to={child.to}
                          onClick={closeSidebarOnMobile}
                          className={cn(
                            'flex items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors',
                            isActive
                              ? 'bg-indigo-500/15 font-semibold text-indigo-300'
                              : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200',
                          )}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <ChildIcon className="size-4" />
                          {child.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </nav>

          <div className="border-t border-slate-800/80 px-3 py-4">
            <Link
              to="/settings/profile"
              onClick={closeSidebarOnMobile}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 transition-colors hover:bg-slate-900/80 hover:text-slate-200"
            >
              <UserCircle2 className="size-[18px]" />
              Profile Settings
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
