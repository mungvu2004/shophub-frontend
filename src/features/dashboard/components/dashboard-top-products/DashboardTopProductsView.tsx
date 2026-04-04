import type {
  DashboardTopProductsViewModel,
  TopProductsMetricId,
  TopProductsPlatformId,
  TopProductsRangeDays,
} from '@/features/dashboard/logic/dashboardTopProducts.types'

import { TopProductsControls } from './TopProductsControls'
import { TopProductsDecliningSection } from './TopProductsDecliningSection'
import { TopProductsInsightsSection } from './TopProductsInsightsSection'
import { TopProductsPodiumSection } from './TopProductsPodiumSection'
import { TopProductsRankingTable } from './TopProductsRankingTable'

type DashboardTopProductsViewProps = {
  model: DashboardTopProductsViewModel
  isRefreshing: boolean
  onMetricChange: (metric: TopProductsMetricId) => void
  onRangeChange: (rangeDays: TopProductsRangeDays) => void
  onPlatformChange: (platform: TopProductsPlatformId) => void
}

export function DashboardTopProductsView({
  model,
  isRefreshing,
  onMetricChange,
  onRangeChange,
  onPlatformChange,
}: DashboardTopProductsViewProps) {
  return (
    <div className="space-y-6 pb-8">
      <TopProductsControls
        model={model}
        isRefreshing={isRefreshing}
        onMetricChange={onMetricChange}
        onRangeChange={onRangeChange}
        onPlatformChange={onPlatformChange}
      />

      {model.hasData ? (
        <>
          <TopProductsPodiumSection cards={model.podiumCards} />

          <TopProductsRankingTable rows={model.rankingRows} />

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <TopProductsInsightsSection
                insights={model.insights}
                contribution={model.contribution}
                totalLabel={model.contributionTotalLabel}
              />
            </div>

            <div className="xl:col-span-2">
              <TopProductsDecliningSection title={model.decliningTitle} items={model.decliningItems} />
            </div>
          </section>
        </>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-sm font-medium text-slate-500">
          Chưa có dữ liệu top sản phẩm cho bộ lọc hiện tại.
        </div>
      )}
    </div>
  )
}
