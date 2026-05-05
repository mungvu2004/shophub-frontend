import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { DataLoadErrorState } from '@/components/shared/DataLoadErrorState'
import { RevenueDailyChartSection } from '@/features/revenue/components/revenue-summary-report/RevenueDailyChartSection'
import { RevenueKpiSection } from '@/features/revenue/components/revenue-summary-report/RevenueKpiSection'
import { RevenueProfitTableSection } from '@/features/revenue/components/revenue-summary-report/RevenueProfitTableSection'
import { RevenueSummaryHeader } from '@/features/revenue/components/revenue-summary-report/RevenueSummaryHeader'
import { useRevenueSummaryActions } from '@/features/revenue/hooks/useRevenueActions'
import {
  RevenueCostBreakdownSection,
  RevenueProfitFlowSection,
  RevenueTopProductsSection,
} from './RevenueTopProductsSection'
import {
  applyRevenuePlatformFilter,
  buildRevenueSummaryReportViewModel,
  filterProductProfits,
  getRevenueComparisonLabel,
  getRevenueRangeLabel,
  paginateProductProfits,
  pickDailyRevenueByRange,
} from '@/features/revenue/logic/revenueSummaryReport.logic'
import { useRevenueSummaryReport } from '@/features/revenue/hooks/useRevenueSummaryReport'
import { useProductData } from '@/features/products/hooks/useProductData'
import type { RevenueRange, RevenueSummaryPlatformFilter } from '@/types/revenue.types'

export function RevenueSummaryReport() {
  // Centralized product data from store
  useProductData({
    autoPreload: false,
    pageName: 'RevenueSummaryReportPage',
  })

  const [selectedRange, setSelectedRange] = useState<RevenueRange>('month')
  const [selectedPlatform, setSelectedPlatform] = useState<RevenueSummaryPlatformFilter>('all')
  const [keyword, setKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const reportMonth = useMemo(() => {
    const now = new Date()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    return `${now.getFullYear()}-${month}`
  }, [])

  const reportBaseDate = useMemo(() => {
    return new Date(`${reportMonth}-01T00:00:00`)
  }, [reportMonth])

  const { data, isLoading, isError, refetch } = useRevenueSummaryReport(reportMonth)

  const revenueActions = useRevenueSummaryActions({
    onSuccess: () => {
      void refetch()
    },
    onError: (error) => {
      console.error('Revenue action error:', error)
    },
  })

  const handleExportPdf = async () => {
    await revenueActions.handleExport()
  }

  const handleRefreshData = async () => {
    await revenueActions.handleRefresh(reportMonth)
  }

  const handleViewTopProductsDetail = () => {
    setCurrentPage(1)
    setKeyword('')

    const tableElement = document.getElementById('revenue-profit-table')
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      toast.success('Đã chuyển đến bảng Lợi nhuận theo sản phẩm.')
    }
  }

  const scopedData = useMemo(() => {
    if (!data) {
      return null
    }

    const platformFilteredReport = applyRevenuePlatformFilter(data, selectedPlatform)

    return {
      ...platformFilteredReport,
      periodLabel: getRevenueRangeLabel(selectedRange, reportBaseDate),
      comparisonLabel: getRevenueComparisonLabel(selectedRange, reportBaseDate),
      dailyRevenue: pickDailyRevenueByRange(platformFilteredReport.dailyRevenue, selectedRange),
    }
  }, [data, reportBaseDate, selectedPlatform, selectedRange])

  const filteredRows = useMemo(
    () => filterProductProfits(scopedData?.productProfits ?? [], keyword),
    [scopedData?.productProfits, keyword],
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
    if (!scopedData) {
      return null
    }

    const stablePageRows = paginateProductProfits(filteredRows, safePage, paginatedRows.pageSize)

    return buildRevenueSummaryReportViewModel(scopedData, stablePageRows.rows)
  }, [scopedData, filteredRows, paginatedRows.pageSize, safePage])

  if (isLoading) {
    return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">Đang tải báo cáo doanh thu...</div>
  }

  if (isError || !model) {
    return <DataLoadErrorState title="Không tải được báo cáo doanh thu." onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-8">
      <RevenueSummaryHeader
        title={model.title}
        selectedRange={selectedRange}
        selectedPlatform={selectedPlatform}
        onRangeChange={(nextRange) => setSelectedRange(nextRange)}
        onPlatformChange={(nextPlatform) => setSelectedPlatform(nextPlatform)}
        onExportPdf={handleExportPdf}
        onRefresh={handleRefreshData}
        isExporting={revenueActions.isExporting}
        isRefreshing={revenueActions.isRefreshing}
      />

      <RevenueKpiSection kpis={model.kpis} />

      <section className="grid grid-cols-1 gap-4 xl:min-h-[520px] xl:grid-cols-[2fr_1fr] xl:items-stretch">
        <div className="grid gap-4 xl:h-full xl:grid-rows-[60fr_40fr]">
          <RevenueDailyChartSection
            periodLabel={model.periodLabel}
            comparisonLabel={model.comparisonLabel}
            dailyRevenue={model.dailyRevenue}
            selectedPlatform={selectedPlatform}
          />

          <RevenueTopProductsSection topProducts={model.topProducts} onViewDetails={handleViewTopProductsDetail} />
        </div>

        <div className="grid gap-4 xl:h-full xl:grid-rows-[30fr_70fr]">
          <RevenueCostBreakdownSection costBreakdown={model.costBreakdown} />

          <RevenueProfitFlowSection
            profitFlow={model.profitFlow}
            profitFlowMax={model.profitFlowMax}
          />
        </div>
      </section>

      <section id="revenue-profit-table" className="mt-10 self-start">
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
      </section>
    </div>
  )
}
