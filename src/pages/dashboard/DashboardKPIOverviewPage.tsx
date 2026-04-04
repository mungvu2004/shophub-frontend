import {
  buildDashboardKPIOverviewViewModel,
  type DashboardKPIOverviewPageProps,
} from '@/features/dashboard/logic/dashboardKpiOverview.logic'
import { AIInsightsColumn } from '@/features/dashboard/components/dashboard-bottom-row/AIInsightsColumn'
import { TopProductsTable } from '@/features/dashboard/components/dashboard-bottom-row/TopProductsTable'
import { DashboardNoDataStateSection } from '@/features/dashboard/components/dashboard-empty-state/DashboardNoDataStateSection'
import { AllocationDonutChart } from '@/features/dashboard/components/dashboard-revenue-charts/AllocationDonutChart'
import { DashboardKPIOverviewView } from '@/features/dashboard/components/dashboard-kpi-overview/DashboardKPIOverviewView'
import { RevenueLineChart } from '@/features/dashboard/components/dashboard-revenue-charts/RevenueLineChart'
import { useInventoryAlerts, useRevenueData } from '@/features/dashboard/hooks/useDashboardStats'

export function DashboardKPIOverviewPage(props: DashboardKPIOverviewPageProps) {
  const { data: orders, isLoading, isError } = useRevenueData(7)
  const { data: inventoryAlerts } = useInventoryAlerts()

  const hasOrders = Array.isArray(orders) && orders.length > 0
  const isNoDataState = isError || (!isLoading && !hasOrders)

  const model = buildDashboardKPIOverviewViewModel({
    ...props,
    tabs: isNoDataState
      ? [
          { id: 'all', label: 'Tất cả', count: '(0)' },
          { id: 'shopee', label: 'Shopee', count: '(0)', dotColor: '#F97316' },
          { id: 'tiktok', label: 'TikTok Shop', count: '(0)', dotColor: '#0F172A' },
        ]
      : props.tabs,
    showMonthlyGoal: !isNoDataState,
  })

  return (
    <div className="space-y-6">
      <DashboardKPIOverviewView model={model} />

      {isNoDataState ? (
        <DashboardNoDataStateSection />
      ) : (
        <>
          <section className="grid grid-cols-1 gap-8 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <RevenueLineChart orders={orders} isLoading={isLoading} isError={isError} days={7} />
            </div>

            <div className="xl:col-span-2">
              <AllocationDonutChart orders={orders} isLoading={isLoading} isError={isError} />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-8 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <TopProductsTable orders={orders} />
            </div>

            <div className="xl:col-span-2">
              <AIInsightsColumn alerts={inventoryAlerts} />
            </div>
          </section>
        </>
      )}
    </div>
  )
}


