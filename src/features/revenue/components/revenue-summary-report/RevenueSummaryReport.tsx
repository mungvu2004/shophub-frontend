import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { RevenueDailyChartSection } from '@/features/revenue/components/revenue-summary-report/RevenueDailyChartSection'
import { RevenueGoalSection } from '@/features/revenue/components/revenue-summary-report/RevenueGoalSection'
import { RevenueKpiSection } from '@/features/revenue/components/revenue-summary-report/RevenueKpiSection'
import { RevenueProfitTableSection } from '@/features/revenue/components/revenue-summary-report/RevenueProfitTableSection'
import { RevenueSummaryHeader } from '@/features/revenue/components/revenue-summary-report/RevenueSummaryHeader'
import { RevenueTopProductsSection } from '@/features/revenue/components/revenue-summary-report/RevenueTopProductsSection'
import {
  buildRevenueSummaryReportViewModel,
  filterProductProfits,
  getRevenueComparisonLabel,
  getRevenueRangeLabel,
  paginateProductProfits,
  pickDailyRevenueByRange,
} from '@/features/revenue/logic/revenueSummaryReport.logic'
import { useRevenueSummaryReport } from '@/features/revenue/hooks/useRevenueSummaryReport'
import type { RevenueRange } from '@/types/revenue.types'

export function RevenueSummaryReport() {
  const [selectedRange, setSelectedRange] = useState<RevenueRange>('month')
  const [keyword, setKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const { data, isLoading, isError } = useRevenueSummaryReport('2026-03')

  const filteredRows = useMemo(
    () => filterProductProfits(data?.productProfits ?? [], keyword),
    [data?.productProfits, keyword],
  )

  const paginatedRows = useMemo(
    () => paginateProductProfits(filteredRows, currentPage, pageSize),
    [filteredRows, currentPage, pageSize],
  )

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / paginatedRows.pageSize))

  const safePage = currentPage > totalPages ? totalPages : currentPage

  useEffect(() => {
    if (isError) {
      toast.error('Không tải được báo cáo doanh thu. Vui lòng thử lại.')
    }
  }, [isError])

  const model = useMemo(() => {
    if (!data) {
      return null
    }

    const scopedReport = {
      ...data,
      periodLabel: getRevenueRangeLabel(selectedRange),
      comparisonLabel: getRevenueComparisonLabel(selectedRange),
      dailyRevenue: pickDailyRevenueByRange(data.dailyRevenue, selectedRange),
    }

    const stablePageRows = paginateProductProfits(filteredRows, safePage, paginatedRows.pageSize)

    return buildRevenueSummaryReportViewModel(scopedReport, stablePageRows.rows)
  }, [data, filteredRows, paginatedRows.pageSize, safePage, selectedRange])

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải báo cáo doanh thu...</div>
  }

  if (isError || !model) {
    return <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-sm font-semibold text-rose-600">Không tải được báo cáo doanh thu.</div>
  }

  return (
    <div className="space-y-6">
      <RevenueSummaryHeader
        title={model.title}
        selectedRange={selectedRange}
        onRangeChange={(nextRange) => setSelectedRange(nextRange)}
      />

      <RevenueKpiSection kpis={model.kpis} />

      <RevenueGoalSection
        monthlyGoalLabel={model.monthlyGoalLabel}
        goalProgressLabel={model.goalProgressLabel}
        goalProgressPercent={model.goalProgressPercent}
      />

      <RevenueDailyChartSection
        periodLabel={model.periodLabel}
        comparisonLabel={model.comparisonLabel}
        dailyRevenue={model.dailyRevenue}
      />

      <RevenueTopProductsSection
        topProducts={model.topProducts}
        profitMomentum={model.profitMomentum}
        profitMomentumMax={model.profitMomentumMax}
      />

      <RevenueProfitTableSection
        keyword={keyword}
        onKeywordChange={(value) => {
          setKeyword(value)
          setCurrentPage(1)
        }}
        currentPage={safePage}
        pageSize={paginatedRows.pageSize}
        totalCount={filteredRows.length}
        rows={model.productProfitRows}
        totalProducts={model.totalProducts}
        onPageChange={setCurrentPage}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize)
          setCurrentPage(1)
        }}
      />
    </div>
  )
}
