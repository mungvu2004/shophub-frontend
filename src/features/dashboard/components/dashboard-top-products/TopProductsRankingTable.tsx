import { useCallback, useMemo, useState } from 'react'
import { MoreVertical } from 'lucide-react'
import { toast } from 'sonner'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable, type DataTableColumn, type DataTableSortState } from '@/components/shared/DataTable'

import type {
  DashboardTopProductsViewModel,
  TopProductsPlatformId,
  TopProductsRankingRowViewModel,
} from '@/features/dashboard/logic/dashboardTopProducts.types'

import { ProductTag } from './ProductTag'
import { TopProductsRankBadge } from './TopProductsRankBadge'
import { TopProductsSparkline } from './TopProductsSparkline'

type TopProductsRankingTableProps = {
  rows: DashboardTopProductsViewModel['rankingRows']
  onProductClick: (productId: string) => void
  onQuickFilterPlatform: (platform: TopProductsPlatformId) => void
}

const INITIAL_VISIBLE_ROWS = 6

type OptionalColumnId = 'sku' | 'platform' | 'sold' | 'revenue' | 'avgPrice' | 'returnRate' | 'trend' | 'sparkline'

type VisibleColumns = Record<OptionalColumnId, boolean>

const defaultVisibleColumns: VisibleColumns = {
  sku: true,
  platform: true,
  sold: true,
  revenue: true,
  avgPrice: true,
  returnRate: true,
  trend: true,
  sparkline: true,
}

const columnLabels: Record<OptionalColumnId, string> = {
  sku: 'SKU',
  platform: 'Sàn',
  sold: 'Đã bán',
  revenue: 'Doanh thu',
  avgPrice: 'Giá TB',
  returnRate: 'Tỷ lệ hoàn',
  trend: 'Xu hướng',
  sparkline: '7 Ngày',
}

const platformClassMap = {
  shopee: 'bg-orange-100 text-orange-700',
  lazada: 'bg-indigo-100 text-indigo-800',
  tiktok: 'bg-slate-900 text-white',
}

const toneToPlatformMap: Record<DashboardTopProductsViewModel['rankingRows'][number]['platformTone'], TopProductsPlatformId> = {
  shopee: 'shopee',
  lazada: 'lazada',
  tiktok: 'tiktok_shop',
}

export function getNextVisibleRankingCount(current: number, step: number, total: number) {
  return Math.min(total, current + step)
}

export function getCollapsedVisibleRankingCount() {
  return INITIAL_VISIBLE_ROWS
}

function compareUnknown(a: any, b: any): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  const valA = a === null || a === undefined ? '' : String(a)
  const valB = b === null || b === undefined ? '' : String(b)
  return valA.localeCompare(valB, 'vi')
}

export function TopProductsRankingTable({ rows, onProductClick, onQuickFilterPlatform }: TopProductsRankingTableProps) {
  const [visibleRowsCount, setVisibleRowsCount] = useState(INITIAL_VISIBLE_ROWS)
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>(defaultVisibleColumns)
  const [sortState, setSortState] = useState<DataTableSortState>({ columnId: 'rank', direction: 'asc' })

  const handleToggleColumn = useCallback((columnId: OptionalColumnId) => {
    setVisibleColumns((current) => ({
      ...current,
      [columnId]: !current[columnId],
    }))
  }, [])

  const handleCopySku = useCallback(async (sku: string) => {
    try {
      await navigator.clipboard.writeText(sku)
      toast.success('Đã sao chép SKU.')
    } catch {
      toast.error('Không thể sao chép SKU trên trình duyệt hiện tại.')
    }
  }, [])

  const columns = useMemo((): DataTableColumn<TopProductsRankingRowViewModel>[] => {
    const cols: DataTableColumn<TopProductsRankingRowViewModel>[] = [
      {
        id: 'rank',
        header: 'Hạng',
        widthClassName: 'w-20',
        cell: (row) => (
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-slate-700">{row.rankLabel}</span>
            <TopProductsRankBadge change={row.rankChange} />
          </div>
        ),
      },
      {
        id: 'product',
        header: 'Sản phẩm',
        cell: (row) => (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onProductClick(row.id)}
              className="h-10 w-10 shrink-0 overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <img src={row.imageUrl} alt={row.name} className="h-full w-full object-cover" />
            </button>
            <div className="flex flex-col gap-1 overflow-hidden">
              <button
                type="button"
                onClick={() => onProductClick(row.id)}
                className="line-clamp-1 text-left text-sm font-semibold text-slate-900 hover:text-primary-600"
              >
                {row.name}
              </button>
              <div className="flex flex-wrap gap-1">
                {row.tags.map((tag) => (
                  <ProductTag key={tag.type} tag={tag} />
                ))}
              </div>
            </div>
          </div>
        ),
      },
    ]

    if (visibleColumns.sku) {
      cols.push({
        id: 'sku',
        header: 'SKU',
        align: 'center',
        accessor: 'sku',
        cell: (row) => <span className="font-mono text-[10px] uppercase text-slate-500">{row.sku}</span>,
      })
    }

    if (visibleColumns.platform) {
      cols.push({
        id: 'platform',
        header: 'Sàn',
        align: 'center',
        accessor: 'platformLabel',
        cell: (row) => (
          <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold ${platformClassMap[row.platformTone]}`}>
            {row.platformLabel}
          </span>
        ),
      })
    }

    if (visibleColumns.sold) {
      cols.push({
        id: 'sold',
        header: 'Đã bán',
        align: 'right',
        sortable: true,
        sortAccessor: (row) => row.soldValue,
        cell: (row) => <span className="font-mono text-sm text-slate-900">{row.soldLabel}</span>,
      })
    }

    if (visibleColumns.revenue) {
      cols.push({
        id: 'revenue',
        header: 'Doanh thu',
        align: 'right',
        sortable: true,
        sortAccessor: (row) => row.revenueValue,
        cell: (row) => <span className="font-mono text-sm font-bold text-primary-600">{row.revenueLabel}</span>,
      })
    }

    if (visibleColumns.avgPrice) {
      cols.push({
        id: 'avgPrice',
        header: 'Giá TB',
        align: 'right',
        sortable: true,
        sortAccessor: (row) => row.avgPriceValue,
        cell: (row) => <span className="font-mono text-sm text-slate-900">{row.avgPriceLabel}</span>,
      })
    }

    if (visibleColumns.returnRate) {
      cols.push({
        id: 'returnRate',
        header: 'Tỷ lệ hoàn',
        align: 'right',
        sortable: true,
        sortAccessor: (row) => row.returnRateValue,
        cell: (row) => <span className="font-mono text-sm text-slate-900">{row.returnRateLabel}</span>,
      })
    }

    if (visibleColumns.trend) {
      cols.push({
        id: 'trend',
        header: 'Xu hướng',
        align: 'center',
        cell: (row) => (
          <div
            className="inline-flex items-end gap-1 rounded-md bg-slate-50 px-2 py-1"
            role="img"
            aria-label={`Xu hướng ${row.trendTone === 'up' ? 'tăng' : 'giảm'}`}
          >
            {row.trendBars.map((bar, index) => (
              <span
                key={`${row.id}-bar-${index}`}
                className={`w-2 rounded-sm ${row.trendTone === 'up' ? 'bg-primary-500' : 'bg-red-400'}`}
                style={{ height: `${bar}px` }}
              />
            ))}
          </div>
        ),
      })
    }

    if (visibleColumns.sparkline) {
      cols.push({
        id: 'sparkline',
        header: '7 Ngày',
        align: 'center',
        widthClassName: 'w-32',
        cell: (row) => <TopProductsSparkline data={row.sparklineData} tone={row.trendTone} />,
      })
    }

    cols.push({
      id: 'actions',
      header: 'Tác vụ',
      align: 'center',
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-md p-1 text-slate-500 hover:bg-slate-100" aria-label={`Tác vụ sản phẩm ${row.name}`}>
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem className="cursor-pointer" onClick={() => onProductClick(row.id)}>
              Xem chi tiết sản phẩm
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => handleCopySku(row.sku)}>
              Sao chép SKU
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                onQuickFilterPlatform(toneToPlatformMap[row.platformTone])
                toast.success(`Đã lọc theo sàn ${row.platformLabel}.`)
              }}
            >
              Lọc theo sàn này
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    })

    return cols
  }, [onProductClick, onQuickFilterPlatform, visibleColumns])

  const sortedAndVisibleRows = useMemo(() => {
    const sorted = [...rows]
    const activeColumn = columns.find(c => c.id === sortState.columnId)
    
    if (activeColumn && activeColumn.sortable) {
      sorted.sort((a, b) => {
        const valA = activeColumn.sortAccessor 
          ? activeColumn.sortAccessor(a) 
          : (activeColumn.accessor 
              ? (typeof activeColumn.accessor === 'function' ? activeColumn.accessor(a) : (a as any)[activeColumn.accessor]) 
              : null)
        const valB = activeColumn.sortAccessor 
          ? activeColumn.sortAccessor(b) 
          : (activeColumn.accessor 
              ? (typeof activeColumn.accessor === 'function' ? activeColumn.accessor(b) : (b as any)[activeColumn.accessor]) 
              : null)
        
        const result = compareUnknown(valA, valB)
        return sortState.direction === 'asc' ? result : -result
      })
    }

    return sorted.slice(0, visibleRowsCount)
  }, [rows, columns, sortState, visibleRowsCount])

  const hasMoreRows = visibleRowsCount < rows.length
  const canCollapse = visibleRowsCount > INITIAL_VISIBLE_ROWS

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-50 px-5 py-4">
        <h3 className="text-base font-bold text-slate-900">Danh sách xếp hạng đầy đủ</h3>
        <button
          type="button"
          onClick={() => setIsCustomizeOpen((prev) => !prev)}
          className="text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          Tuỳ chỉnh báo cáo
        </button>
      </header>

      {isCustomizeOpen ? (
        <div className="border-b border-slate-50 bg-slate-50/50 px-5 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Ẩn/hiện cột</p>
            <div className="flex flex-wrap gap-3">
              {(Object.keys(columnLabels) as OptionalColumnId[]).map((id) => (
                <label key={id} className="inline-flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={visibleColumns[id]}
                    onChange={() => handleToggleColumn(id)}
                    className="h-3.5 w-3.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  {columnLabels[id]}
                </label>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <DataTable
          rows={sortedAndVisibleRows}
          columns={columns}
          rowKey={(row) => row.id}
          tableClassName="min-w-[960px]"
          sortState={sortState}
          onSortChange={setSortState}
        />
      </div>

      <footer className="border-t border-slate-50 py-3 text-center text-xs font-semibold text-slate-700">
        <div className="flex items-center justify-center gap-4">
          {hasMoreRows ? (
            <button
              type="button"
              className="text-primary-600 hover:text-primary-700"
              onClick={() => setVisibleRowsCount((current) => getNextVisibleRankingCount(current, INITIAL_VISIBLE_ROWS, rows.length))}
            >
              Xem thêm {Math.min(INITIAL_VISIBLE_ROWS, rows.length - visibleRowsCount)} sản phẩm
            </button>
          ) : (
            <span>Đã hiển thị tất cả sản phẩm</span>
          )}

          {canCollapse ? (
            <button
              type="button"
              className="text-slate-500 hover:text-slate-700"
              onClick={() => setVisibleRowsCount(getCollapsedVisibleRankingCount())}
            >
              Thu gọn
            </button>
          ) : null}
        </div>
      </footer>
    </section>
  )
}
