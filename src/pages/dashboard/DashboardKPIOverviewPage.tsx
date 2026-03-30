import {
  buildDashboardKPIOverviewViewModel,
  type DashboardKPIOverviewPageProps,
} from '@/features/dashboard/logic/dashboardKpiOverview.logic'
import { DashboardKPIOverviewView } from '@/features/dashboard/components/dashboard-kpi-overview/DashboardKPIOverviewView'

export function DashboardKPIOverviewPage(props: DashboardKPIOverviewPageProps) {
  const model = buildDashboardKPIOverviewViewModel(props)

  return <DashboardKPIOverviewView model={model} />
}


