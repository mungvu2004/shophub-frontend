import { MoveRight, TrendingDown, TrendingUp } from 'lucide-react'

import { DataTable, type DataTableColumn } from '@/components/shared/DataTable'
import { SearchInput } from '@/components/shared/SearchInput'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import type {
  CompetitorPlatform,
  CompetitorPriceRow,
  CompetitorTrackingViewModel,
} from '@/features/products/logic/productsCompetitorTracking.types'

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

const platformLabelMap: Record<CompetitorPlatform, string> = {
  shopee: 'Shopee',
  tiktok_shop: 'TikTok Shop',
  lazada: 'Lazada',
}

const platformBadgeClassMap: Record<CompetitorPlatform, string> = {
  shopee: 'bg-orange-100 text-orange-700 hover:bg-orange-100',
  tiktok_shop: 'bg-slate-900 text-white hover:bg-slate-900',
  lazada: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
}

const rankBadgeClass = (rank: number, total: number) => {
  const ratio = rank / Math.max(total, 1)

  if (ratio <= 0.34) {
    return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
  }

  if (ratio <= 0.67) {
    return 'bg-amber-100 text-amber-700 hover:bg-amber-100'
  }

  return 'bg-rose-100 text-rose-700 hover:bg-rose-100'
}

export function CompetitorComparisonTable({ model }: { model: CompetitorTrackingViewModel }) {
  const columns: DataTableColumn<CompetitorPriceRow>[] = [
    {
      id: 'productName',
      header: 'Sản phẩm',
      widthClassName: 'min-w-[200px] px-4',
      cellClassName: 'px-4',
      sortable: true,
      accessor: 'productName',
      cell: (row) => (
        <span className="font-semibold text-slate-900 hover:text-indigo-700">{row.productName}</span>
      ),
    },
    {
      id: 'yourPrice',
      header: 'Giá của bạn',
      widthClassName: 'min-w-[110px] pr-4',
      cellClassName: 'pr-4 font-mono text-slate-800 font-semibold',
      align: 'right',
      sortable: true,
      accessor: (row) => currencyFormatter.format(row.yourPrice),
      sortAccessor: (row) => row.yourPrice,
    },
    {
      id: 'marketAveragePrice',
      header: 'Giá TB',
      widthClassName: 'min-w-[110px] pr-4',
      cellClassName: 'pr-4 font-mono text-slate-500',
      align: 'right',
      sortable: true,
      accessor: (row) => currencyFormatter.format(row.marketAveragePrice),
      sortAccessor: (row) => row.marketAveragePrice,
    },
    {
      id: 'lowestMarketPrice',
      header: 'Thấp nhất',
      widthClassName: 'min-w-[110px] pr-4',
      cellClassName: 'pr-4 font-mono text-rose-600 font-bold',
      align: 'right',
      sortable: true,
      accessor: (row) => currencyFormatter.format(row.lowestMarketPrice),
      sortAccessor: (row) => row.lowestMarketPrice,
    },
    {
      id: 'rank',
      header: 'Vị thế',
      widthClassName: 'min-w-[80px] text-center',
      align: 'center',
      sortable: true,
      sortAccessor: (row) => row.rank,
      cell: (row) => (
        <Badge className={rankBadgeClass(row.rank, row.totalCompetitors)}>
          #{row.rank}/{row.totalCompetitors}
        </Badge>
      ),
    },
    {
      id: 'trend',
      header: 'Xu hướng',
      widthClassName: 'min-w-[80px] text-center',
      align: 'center',
      cell: (row) => (
        <span className="inline-flex items-center justify-center text-sm">
          {row.trend === 'up' ? (
            <TrendingUp className="size-4 text-rose-500" />
          ) : row.trend === 'down' ? (
            <TrendingDown className="size-4 text-emerald-500" />
          ) : (
            <MoveRight className="size-4 text-slate-300" />
          )}
        </span>
      ),
    },
    {
      id: 'platform',
      header: 'Nền tảng',
      widthClassName: 'min-w-[120px] text-right pr-6',
      align: 'right',
      cell: (row) => (
        <Badge className={platformBadgeClassMap[row.platform]}>
          {platformLabelMap[row.platform]}
        </Badge>
      ),
    },
  ]

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_60px_-35px_rgba(15,23,42,0.4)]">
      <header className="flex flex-col gap-3 border-b border-slate-100 bg-[linear-gradient(135deg,#f0f9ff_0%,#ffffff_48%,#f0fdf4_100%)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-900">Chi tiết so sánh giá hiện tại</h3>
          <Badge variant="secondary" className="bg-sky-100 text-sky-700">LIVE DATA</Badge>
        </div>

        <SearchInput
          value={model.searchValue}
          onChange={model.onSearchChange}
          placeholder="Tìm kiếm sản phẩm..."
        />
      </header>

      <div className="px-5 py-4 overflow-x-auto">
        <DataTable
          rows={model.paginatedRows}
          columns={columns}
          rowKey={(row) => row.id}
          tableClassName="w-full min-w-[900px] [&_th]:whitespace-nowrap [&_td]:align-middle"
          disableScroll
          emptyText="Không có dữ liệu so sánh phù hợp."
          onRowClick={(row) => model.onOpenProductDetail(row.productId)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4">
        <p className="text-[13px] text-slate-500">
          Hiển thị {model.paginatedRows.length} trên tổng {model.filteredRows.length} sản phẩm
        </p>
        <Pagination
          currentPage={model.currentPage}
          totalCount={model.filteredRows.length}
          pageSize={model.pageSize}
          onPageChange={model.onPageChange}
          onPageSizeChange={model.onPageSizeChange}
          pageSizeOptions={[5, 10, 20]}
          compact
        />
      </div>
    </section>
  )
}
