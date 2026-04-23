import {
  type DashboardKPIOverviewPageProps,
} from '@/features/dashboard/logic/dashboardKpiOverview.logic'
import { useDashboardKPIOverview } from '@/features/dashboard/hooks/useDashboardKPIOverview'
import { AIInsightsColumn } from '@/features/dashboard/components/dashboard-bottom-row/AIInsightsColumn'
import { TopProductsTable } from '@/features/dashboard/components/dashboard-bottom-row/TopProductsTable'
import { DashboardNoDataStateSection } from '@/features/dashboard/components/dashboard-empty-state/DashboardNoDataStateSection'
import { AllocationDonutChart } from '@/features/dashboard/components/dashboard-revenue-charts/AllocationDonutChart'
import { DashboardKPIOverviewView } from '@/features/dashboard/components/dashboard-kpi-overview/DashboardKPIOverviewView'
import { RevenueLineChart } from '@/features/dashboard/components/dashboard-revenue-charts/RevenueLineChart'
import { useInventoryAlerts, useRevenueData } from '@/features/dashboard/hooks/useDashboardStats'

export function DashboardKPIOverviewPage(props: DashboardKPIOverviewPageProps) {
  const { data: orders, isLoading, isError, refetch, isFetching } = useRevenueData(30)
  const { data: inventoryAlerts } = useInventoryAlerts()

  const hasOrders = Array.isArray(orders) && orders.length > 0
  const isNoDataState = isError || (!isLoading && !hasOrders)

  // Calculate Monthly Goal from orders
  const monthlyGoalTarget = 5000000000 // 5 tỷ VND
  const currentMonthlyRevenue = hasOrders 
    ? orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0)
    : 0
  
  const monthlyGoal = {
    label: 'Mục tiêu doanh thu tháng này',
    currentValue: (currentMonthlyRevenue / 1000000).toFixed(1) + 'M',
    targetValue: (monthlyGoalTarget / 1000000).toFixed(0) + 'M',
    progressPercent: Math.round((currentMonthlyRevenue / monthlyGoalTarget) * 100),
  }

  const { model, filteredOrders } = useDashboardKPIOverview(orders, isNoDataState, {
    ...props,
    monthlyGoal,
    onRefresh: () => refetch(),
    isRefreshing: isFetching,
  })

  // Filter for 7 days view in charts
  const now = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(now.getDate() - 7)
  const orders7Days = hasOrders 
    ? orders.filter(o => new Date(o.createdAt || '') >= sevenDaysAgo)
    : []

  return (
    <div className="space-y-6">
      <DashboardKPIOverviewView model={model} />

      {isNoDataState ? (
        <DashboardNoDataStateSection />
      ) : (
        <>
          <section className="grid grid-cols-1 gap-8 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <RevenueLineChart orders={orders7Days} isLoading={isLoading} isError={isError} days={7} />
            </div>

            <div className="xl:col-span-2">
              <AllocationDonutChart orders={filteredOrders} isLoading={isLoading} isError={isError} />
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center">
              <h2 className="text-lg font-bold text-slate-900">Sản phẩm & Cảnh báo</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-5">
              <div className="xl:col-span-3">
                <TopProductsTable orders={filteredOrders} />
              </div>

              <div className="xl:col-span-2">
                <AIInsightsColumn alerts={inventoryAlerts} />
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}


