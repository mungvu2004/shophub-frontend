import { DataTable, type DataTableColumn, type DataTableSortState } from '@/components/shared/DataTable'
import { Pagination } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import type { InventoryTableViewModel } from '@/features/inventory/logic/inventoryTable.types'
import { ChevronRight, Edit2, Trash2 } from 'lucide-react'
import { useMemo } from 'react'

type InventoryTableProps = {
  model: InventoryTableViewModel
}

const statusConfig = {
  normal: { label: 'Bình thường', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', dotColor: 'bg-emerald-500' },
  warning: { label: 'Thấp ⚠', bgColor: 'bg-amber-50', textColor: 'text-amber-700', dotColor: 'bg-amber-500' },
  critical: { label: 'Hết hàng', bgColor: 'bg-red-50', textColor: 'text-red-700', dotColor: 'bg-red-500' },
  discontinued: { label: 'Ngừng bán', bgColor: 'bg-slate-50', textColor: 'text-slate-700', dotColor: 'bg-slate-400' },
}

function getStickyRowBackground(status: 'normal' | 'warning' | 'critical' | 'discontinued') {
  if (status === 'warning') return 'bg-amber-50/30 group-hover:bg-amber-50/40'
  if (status === 'critical') return 'bg-red-50/30 group-hover:bg-red-50/40'
  if (status === 'discontinued') return 'bg-slate-50/30 group-hover:bg-slate-50/40'
  return 'bg-white group-hover:bg-slate-50/50'
}

function getForecastMeta(restockDays?: string) {
  if (restockDays === '<7 ngày') {
    return {
      textClass: 'text-red-700',
      bgClass: 'bg-red-50',
      description: 'Dự kiến hết tồn kho trong dưới 7 ngày tới',
    }
  }

  if (restockDays === '7-14 ngày') {
    return {
      textClass: 'text-amber-700',
      bgClass: 'bg-amber-50',
      description: 'Dự kiến hết tồn kho trong 7-14 ngày tới',
    }
  }

  return {
    textClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
    description: 'Tồn kho an toàn, chưa có rủi ro hết hàng ngắn hạn',
  }
}

function getStatusSortValue(status: InventoryTableViewModel['rows'][number]['status']) {
  if (status === 'critical') return 0
  if (status === 'warning') return 1
  if (status === 'discontinued') return 2
  return 3
}

function getForecastSortValue(restockDays?: string) {
  if (restockDays === '<7 ngày') return 0
  if (restockDays === '7-14 ngày') return 1
  if (restockDays === '>14 ngày') return 2
  return 3
}

function getPlatformBadgeClass(platformType: string) {
  if (platformType === 'Shopee') return 'bg-orange-50 text-orange-700'
  if (platformType === 'TikTok') return 'bg-cyan-50 text-cyan-700'
  if (platformType === 'Lazada') return 'bg-blue-50 text-blue-700'
  if (platformType === 'Da san') return 'bg-violet-50 text-violet-700'
  return 'bg-slate-100 text-slate-600'
}

export function InventoryTable({ model }: InventoryTableProps) {
  const isAllSelected = model.selectedRows.length === model.rows.length && model.rows.length > 0

  const columns = useMemo<DataTableColumn<InventoryTableViewModel['rows'][number]>[]>(() => {
    const tableColumns: DataTableColumn<InventoryTableViewModel['rows'][number]>[] = [
      {
        id: 'select',
        header: (
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={(e) => model.onSelectAll(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
        ),
        widthClassName: 'w-12 min-w-12 sticky left-0 z-30 bg-indigo-50/80 backdrop-blur supports-[backdrop-filter]:bg-indigo-50/70',
        cellClassName: (row) => `sticky left-0 z-20 ${getStickyRowBackground(row.status)}`,
        cell: (row) => (
          <input
            type="checkbox"
            checked={model.selectedRows.includes(row.id)}
            onChange={() => model.onSelectRow(row.id)}
            className="w-4 h-4 cursor-pointer"
          />
        ),
      },
      ...model.columns.map<DataTableColumn<InventoryTableViewModel['rows'][number]>>((col) => {
        const alignClass = col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
        const headerClassName = `text-xs font-bold uppercase text-slate-600 tracking-wide ${alignClass} ${
          col.id === 'image'
            ? 'w-16 min-w-16'
            : ''
        } ${
          col.id === 'productName'
            ? 'min-w-[260px]'
            : ''
        } ${col.id === 'sku' ? 'min-w-[140px]' : ''}`

        if (col.id === 'image') {
          return {
            id: col.id,
            header: col.label,
            align: 'center',
            headerClassName,
            cellClassName: 'text-center py-3',
            cell: (row) => row.image ? <img src={row.image} alt={row.sku} className="w-8 h-8 rounded object-cover" /> : <div className="w-8 h-8 rounded bg-slate-100" />,
          }
        }

        if (col.id === 'sku') {
          return {
            id: col.id,
            header: col.label,
            headerClassName,
            cellClassName: 'font-mono font-medium text-indigo-600 text-sm',
            accessor: (row) => row.sku,
          }
        }

        if (col.id === 'productName') {
          return {
            id: col.id,
            header: col.label,
            headerClassName,
            cellClassName: 'max-w-xs',
            cell: (row) => (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  model.onOpenProductDetail?.(row.id, row.productId)
                }}
                className="text-left text-sm font-medium text-slate-900 break-words whitespace-normal hover:text-indigo-700"
              >
                {row.productName}
              </button>
            ),
          }
        }

        if (col.id === 'category') {
          return {
            id: col.id,
            header: col.label,
            headerClassName,
            cellClassName: 'text-slate-600 text-sm',
            accessor: (row) => row.category,
          }
        }

        if (col.id === 'platformType') {
          return {
            id: col.id,
            header: col.label,
            headerClassName,
            sortable: true,
            sortAccessor: (row) => row.platformType,
            cell: (row) => (
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getPlatformBadgeClass(row.platformType)}`}>
                {row.platformType}
              </span>
            ),
          }
        }

        if (col.id === 'marketplaceStock') {
          return {
            id: col.id,
            header: col.label,
            align: 'right',
            headerClassName,
            cellClassName: 'font-mono text-sm text-slate-900',
            cell: (row) => {
              const marketplaceTotal = row.shopeeStock + row.tiktokStock + row.lazadaStock

              return (
                <button
                  type="button"
                  title={`Chi tiết tồn trên sàn\nShopee: ${row.shopeeStock}\nTikTok: ${row.tiktokStock}\nLazada: ${row.lazadaStock}`}
                  className="rounded px-1.5 py-0.5 hover:bg-slate-100"
                >
                  {marketplaceTotal}
                </button>
              )
            },
          }
        }

        if (col.id === 'actualStock') {
          return {
            id: col.id,
            header: col.label,
            align: 'right',
            headerClassName,
            sortable: true,
            sortAccessor: (row) => row.actualStock,
            cell: (row) => (
              <div className="text-right">
                <p className="font-mono font-medium text-sm text-slate-900">{row.actualStock}</p>
                <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden mt-1 ml-auto">
                  <div
                    className={`h-full ${
                      row.status === 'normal'
                        ? 'bg-emerald-500'
                        : row.status === 'warning'
                          ? 'bg-amber-500'
                          : row.status === 'discontinued'
                            ? 'bg-slate-400'
                            : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((row.actualStock / (row.maxCapacity || 100)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ),
          }
        }

        if (col.id === 'onOrder') {
          return {
            id: col.id,
            header: col.label,
            align: 'right',
            headerClassName,
            cellClassName: 'font-mono text-slate-500 text-sm',
            accessor: (row) => row.onOrder,
          }
        }

        if (col.id === 'available') {
          return {
            id: col.id,
            header: col.label,
            align: 'right',
            headerClassName,
            cellClassName: 'font-mono text-sm text-slate-900',
            accessor: (row) => row.available,
          }
        }

        if (col.id === 'status') {
          return {
            id: col.id,
            header: col.label,
            headerClassName,
            sortable: true,
            sortAccessor: (row) => getStatusSortValue(row.status),
            cell: (row) => {
              const statusInfo = statusConfig[row.status]

              return (
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                  <span className={`text-xs font-medium ${statusInfo.textColor}`}>{statusInfo.label}</span>
                </div>
              )
            },
          }
        }

        if (col.id === 'forecast') {
          return {
            id: col.id,
            header: col.label,
            headerClassName,
            cellClassName: 'text-sm',
            sortable: true,
            sortAccessor: (row) => getForecastSortValue(row.restockDays),
            cell: (row) => {
              const forecast = getForecastMeta(row.restockDays)

              return (
                <span
                  title={forecast.description}
                  className={`inline-flex items-center rounded-md px-2 py-0.5 font-medium ${forecast.bgClass} ${forecast.textClass}`}
                >
                  {row.restockDays || '-'}
                </span>
              )
            },
          }
        }

        return {
          id: col.id,
          header: col.label,
          headerClassName,
          accessor: () => '-',
        }
      }),
      {
        id: 'actions',
        header: 'Hành động',
        align: 'right',
        widthClassName: 'min-w-[110px]',
        headerClassName: 'text-right text-xs font-bold uppercase text-slate-600 min-w-[110px]',
        cellClassName: 'text-right',
        cell: (row) => (
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              type="button" 
              className="p-1 hover:bg-slate-100 rounded"
              onClick={(event) => {
                event.stopPropagation()
                model.onEditRow?.(row.id, row.productId)
              }}
              title="Chỉnh sửa"
            >
              <Edit2 className="w-4 h-4 text-slate-600" />
            </button>
            <button
              type="button"
              className="p-1 hover:bg-slate-100 rounded"
              onClick={(event) => {
                event.stopPropagation()
                model.onOpenProductDetail?.(row.id, row.productId)
              }}
              title="Xem chi tiết"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        ),
      },
    ]

    return tableColumns
  }, [isAllSelected, model])

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
      {/* Bulk Actions Toolbar */}
      {model.selectedRows.length > 0 && (
        <div className="border-b border-slate-200 bg-indigo-50 px-6 py-3 flex items-center justify-between">
          <div className="text-sm font-medium text-slate-700">
            Đã chọn {model.selectedRows.length} mục
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => model.onBulkAdjust?.()}
            >
              Điều chỉnh hàng loạt
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:bg-red-50"
              onClick={() => {
                if (confirm(`Bạn có chắc muốn xóa ${model.selectedRows.length} mục này?`)) {
                  model.onDeleteRows?.(model.selectedRows)
                }
              }}
            >
              <Trash2 className="h-4 w-4" />
              <span className="ml-1.5">Xóa</span>
            </Button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto overflow-y-hidden flex-1">
        {/* Show loading skeleton when isLoading and no rows */}
        {model.isLoading && model.rows.length === 0 ? (
          <div className="p-6">
            <LoadingSkeleton rows={5} />
          </div>
        ) : (
          <DataTable
            rows={model.rows}
            columns={columns}
            sortState={model.sortState as DataTableSortState | undefined}
            onSortChange={(state) => model.onSortChange?.(state)}
            rowKey={(row) => row.id}
            tableClassName="min-w-[1120px]"
            bodyClassName="bg-white"
            rowClassName={(row) => `group border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
              row.status === 'warning'
                ? 'bg-amber-50/30'
                : row.status === 'critical'
                  ? 'bg-red-50/30'
                  : row.status === 'discontinued'
                    ? 'bg-slate-50/30'
                    : ''
            }`}
            emptyText="Không có dữ liệu tồn kho."
          />
        )}
      </div>
      {/* Pagination */}
      <Pagination
        currentPage={model.currentPage}
        totalCount={model.totalCount}
        pageSize={model.pageSize}
        onPageChange={model.onPageChange}
        onPageSizeChange={model.onPageSizeChange}
        pageSizeOptions={model.pageSizeOptions}
      />
    </div>
  )
}
