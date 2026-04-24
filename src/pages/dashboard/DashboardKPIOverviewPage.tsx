import { useState } from 'react'
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
import { TrendRangeSelector } from '@/features/dashboard/components/dashboard-kpi-overview/TrendRangeSelector'
import { useGoalNotifications } from '@/features/dashboard/hooks/useGoalNotifications'

import { MONTHLY_REVENUE_GOAL_TARGET } from '@/features/dashboard/logic/dashboardKpiOverview.constants'

export function DashboardKPIOverviewPage(props: DashboardKPIOverviewPageProps) {
  const [trendDays, setTrendDays] = useState(7)
  const { data: orders, isLoading, isError, refetch, isFetching } = useRevenueData(30)
  const { data: inventoryAlerts } = useInventoryAlerts()

  const hasOrders = Array.isArray(orders) && orders.length > 0
  const isNoDataState = isError || (!isLoading && !hasOrders)

  // Orchestrate Monthly Goal (Logic đã được đưa vào Hook/Constants)
  const currentMonthlyRevenue = hasOrders 
    ? orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0)
    : 0
  
  const progressPercent = Math.round((currentMonthlyRevenue / MONTHLY_REVENUE_GOAL_TARGET) * 100)
  
  const monthlyGoal = {
    label: 'Mục tiêu doanh thu tháng này',
    currentValue: (currentMonthlyRevenue / 1000000).toFixed(1) + 'M',
    targetValue: (MONTHLY_REVENUE_GOAL_TARGET / 1000000).toFixed(0) + 'M',
    progressPercent,
  }


  // Thông báo đạt mục tiêu
  useGoalNotifications(progressPercent)

  const { model, filteredOrders } = useDashboardKPIOverview(orders, isNoDataState, {
    ...props,
    monthlyGoal,
    onRefresh: () => refetch(),
    isRefreshing: isFetching,
  })

  // Filter for trend view in charts based on trendDays
  const now = new Date()
  const trendStartDate = new Date()
  trendStartDate.setDate(now.getDate() - trendDays)
  const ordersTrend = hasOrders 
    ? orders.filter(o => new Date(o.createdAt || '') >= trendStartDate)
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
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Xu hướng doanh thu</h2>
                <TrendRangeSelector value={trendDays} onChange={setTrendDays} />
              </div>
              <RevenueLineChart orders={ordersTrend} isLoading={isLoading} isError={isError} days={trendDays} />
            </div>

            <div className="xl:col-span-2">
              <div className="mb-4 flex items-center h-9">
                <h2 className="text-lg font-bold text-slate-900">Phân bổ kênh</h2>
              </div>
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


