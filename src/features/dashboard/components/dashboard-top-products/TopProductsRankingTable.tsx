import { MoreVertical } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type {
  DashboardTopProductsViewModel,
  TopProductsPlatformId,
} from '@/features/dashboard/logic/dashboardTopProducts.types'

type TopProductsRankingTableProps = {
  rows: DashboardTopProductsViewModel['rankingRows']
  onProductClick: (productId: string) => void
  onQuickFilterPlatform: (platform: TopProductsPlatformId) => void
}

const INITIAL_VISIBLE_ROWS = 6

type OptionalColumnId = 'sku' | 'platform' | 'sold' | 'revenue' | 'avgPrice' | 'returnRate' | 'trend'

type VisibleColumns = Record<OptionalColumnId, boolean>

const defaultVisibleColumns: VisibleColumns = {
  sku: true,
  platform: true,
  sold: true,
  revenue: true,
  avgPrice: true,
  returnRate: true,
  trend: true,
}

const columnDefs: Array<{ id: OptionalColumnId; label: string }> = [
  { id: 'sku', label: 'SKU' },
  { id: 'platform', label: 'Sàn' },
  { id: 'sold', label: 'Đã bán' },
  { id: 'revenue', label: 'Doanh thu' },
  { id: 'avgPrice', label: 'Giá TB' },
  { id: 'returnRate', label: 'Tỷ lệ hoàn' },
  { id: 'trend', label: 'Xu hướng' },
]

export function getNextVisibleRankingCount(current: number, step: number, total: number) {
  return Math.min(total, current + step)
}

export function getCollapsedVisibleRankingCount() {
  return INITIAL_VISIBLE_ROWS
}

export function buildTopProductsCsv(rows: DashboardTopProductsViewModel['rankingRows'], visibleColumns: VisibleColumns) {
  const headers = ['Hạng', 'Sản phẩm']

  if (visibleColumns.sku) headers.push('SKU')
  if (visibleColumns.platform) headers.push('Sàn')
  if (visibleColumns.sold) headers.push('Đã bán')
  if (visibleColumns.revenue) headers.push('Doanh thu')
  if (visibleColumns.avgPrice) headers.push('Giá TB')
  if (visibleColumns.returnRate) headers.push('Tỷ lệ hoàn')
  if (visibleColumns.trend) headers.push('Xu hướng')

  const csvRows = rows.map((row) => {
    const values = [row.rankLabel, row.name]

    if (visibleColumns.sku) values.push(row.sku)
    if (visibleColumns.platform) values.push(row.platformLabel)
    if (visibleColumns.sold) values.push(row.soldLabel)
    if (visibleColumns.revenue) values.push(row.revenueLabel)
    if (visibleColumns.avgPrice) values.push(row.avgPriceLabel)
    if (visibleColumns.returnRate) values.push(row.returnRateLabel)
    if (visibleColumns.trend) values.push(row.trendTone === 'up' ? 'Tăng' : 'Giảm')

    return values
  })

  const toCsvCell = (value: string) => `"${value.replaceAll('"', '""')}"`

  return [headers, ...csvRows].map((line) => line.map(toCsvCell).join(',')).join('\n')
}

const platformClassMap = {
  shopee: 'bg-orange-100 text-orange-600',
  lazada: 'bg-indigo-100 text-indigo-700',
  tiktok: 'bg-slate-900 text-white',
}

const toneToPlatformMap: Record<DashboardTopProductsViewModel['rankingRows'][number]['platformTone'], TopProductsPlatformId> = {
  shopee: 'shopee',
  lazada: 'lazada',
  tiktok: 'tiktok_shop',
}

function triggerCsvDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function TopProductsRankingTable({ rows, onProductClick, onQuickFilterPlatform }: TopProductsRankingTableProps) {
  const [visibleRowsCount, setVisibleRowsCount] = useState(INITIAL_VISIBLE_ROWS)
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>(defaultVisibleColumns)

  const visibleRows = rows.slice(0, visibleRowsCount)
  const hasMoreRows = visibleRowsCount < rows.length
  const canCollapse = visibleRowsCount > INITIAL_VISIBLE_ROWS

  const hiddenColumnsCount = useMemo(
    () => Object.values(visibleColumns).filter((isVisible) => !isVisible).length,
    [visibleColumns],
  )

  const handleToggleColumn = (columnId: OptionalColumnId) => {
    setVisibleColumns((current) => ({
      ...current,
      [columnId]: !current[columnId],
    }))
  }

  const handleExportCsv = () => {
    const csv = buildTopProductsCsv(rows, visibleColumns)
    triggerCsvDownload('top-products-report.csv', csv)
    toast.success('Đã xuất báo cáo CSV Top Products.')
  }

  const handleCopySku = async (sku: string) => {
    try {
      await navigator.clipboard.writeText(sku)
      toast.success('Đã sao chép SKU.')
    } catch {
      toast.error('Không thể sao chép SKU trên trình duyệt hiện tại.')
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e7eeff] bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-[#eef2ff] px-5 py-4">
        <h3 className="text-base font-bold text-[#111c2d]">Danh sách xếp hạng đầy đủ</h3>
        <button
          type="button"
          onClick={() => setIsCustomizeOpen((prev) => !prev)}
          className="text-sm font-semibold text-[#5b4bff] hover:text-[#4338ca]"
        >
          Tuỳ chỉnh báo cáo
        </button>
      </header>

      {isCustomizeOpen ? (
        <div className="border-b border-[#eef2ff] bg-[#f8f9ff] px-5 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#334155]">Ẩn/hiện cột</p>
            <div className="flex flex-wrap gap-3">
              {columnDefs.map((column) => {
                const checked = visibleColumns[column.id]

                return (
                  <label key={column.id} className="inline-flex items-center gap-2 text-xs text-[#334155]">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleColumn(column.id)}
                      className="h-3.5 w-3.5 rounded border-slate-300"
                    />
                    {column.label}
                  </label>
                )
              })}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[#64748b]">
              {hiddenColumnsCount > 0 ? `Đang ẩn ${hiddenColumnsCount} cột.` : 'Đang hiển thị đầy đủ các cột.'}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVisibleColumns(defaultVisibleColumns)}
                className="rounded-md border border-[#dbe1ff] px-3 py-1.5 text-xs font-semibold text-[#334155] hover:bg-white"
              >
                Khôi phục mặc định
              </button>
              <button
                type="button"
                onClick={handleExportCsv}
                className="rounded-md bg-[#4338ca] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#3730a3]"
              >
                Xuất CSV
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="bg-[#f8f9ff] text-[10px] uppercase tracking-[0.08em] text-[#64748b]">
              <th className="px-4 py-3 text-left">Hạng</th>
              <th className="px-4 py-3 text-left">Sản phẩm</th>
              {visibleColumns.sku ? <th className="px-4 py-3 text-center">SKU</th> : null}
              {visibleColumns.platform ? <th className="px-4 py-3 text-center">Sàn</th> : null}
              {visibleColumns.sold ? <th className="px-4 py-3 text-right">Đã bán</th> : null}
              {visibleColumns.revenue ? <th className="px-4 py-3 text-right">Doanh thu</th> : null}
              {visibleColumns.avgPrice ? <th className="px-4 py-3 text-right">Giá TB</th> : null}
              {visibleColumns.returnRate ? <th className="px-4 py-3 text-right">Tỷ lệ hoàn</th> : null}
              {visibleColumns.trend ? <th className="px-4 py-3 text-center">Xu hướng</th> : null}
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id} className="border-t border-[#eef2ff]">
                <td className="px-4 py-4 font-mono text-sm font-semibold text-[#334155]">{row.rankLabel}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        console.log('[TopProducts] Click product:', { productId: row.id, productName: row.name })
                        onProductClick(row.id)
                      }}
                      className="h-10 w-10 overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
                    >
                      <img src={row.imageUrl} alt={row.name} className="h-full w-full object-cover" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('[TopProducts] Click product:', { productId: row.id, productName: row.name })
                        onProductClick(row.id)
                      }}
                      className="line-clamp-1 text-left text-base font-semibold text-[#0f172a] hover:text-[#4338ca]"
                    >
                      {row.name}
                    </button>
                  </div>
                </td>
                {visibleColumns.sku ? <td className="px-4 py-4 text-center font-mono text-[10px] uppercase text-[#64748b]">{row.sku}</td> : null}
                {visibleColumns.platform ? (
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold ${platformClassMap[row.platformTone]}`}>{row.platformLabel}</span>
                  </td>
                ) : null}
                {visibleColumns.sold ? <td className="px-4 py-4 text-right font-mono text-base text-[#111c2d]">{row.soldLabel}</td> : null}
                {visibleColumns.revenue ? <td className="px-4 py-4 text-right font-mono text-base font-bold text-[#4338ca]">{row.revenueLabel}</td> : null}
                {visibleColumns.avgPrice ? <td className="px-4 py-4 text-right font-mono text-base text-[#111c2d]">{row.avgPriceLabel}</td> : null}
                {visibleColumns.returnRate ? <td className="px-4 py-4 text-right font-mono text-base text-[#111c2d]">{row.returnRateLabel}</td> : null}
                {visibleColumns.trend ? (
                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-end gap-1 rounded-md bg-[#eef2ff] px-2 py-1">
                      {row.trendBars.map((bar, index) => (
                        <span
                          key={`${row.id}-bar-${index}`}
                          className={`w-2 rounded-sm ${row.trendTone === 'up' ? 'bg-[#6366f1]' : 'bg-[#f87171]'}`}
                          style={{ height: `${bar}px` }}
                        />
                      ))}
                    </div>
                  </td>
                ) : null}
                <td className="px-4 py-4 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="rounded-md p-1 text-[#64748b] hover:bg-[#f1f5f9]" aria-label={`Tác vụ sản phẩm ${row.name}`}>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="border-t border-[#eef2ff] py-3 text-center text-xs font-semibold text-[#334155]">
        <div className="flex items-center justify-center gap-4">
          {hasMoreRows ? (
            <button
              type="button"
              className="text-[#5b4bff] hover:text-[#4338ca]"
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
              className="text-[#64748b] hover:text-[#334155]"
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
