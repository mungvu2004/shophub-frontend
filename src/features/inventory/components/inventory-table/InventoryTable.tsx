import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import type { InventoryTableViewModel } from '@/features/inventory/logic/inventoryTable.types'
import { ChevronRight, Edit2 } from 'lucide-react'

type InventoryTableProps = {
  model: InventoryTableViewModel
}

const statusConfig = {
  normal: { label: 'Bình thường', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700', dotColor: 'bg-emerald-500' },
  warning: { label: 'Thấp ⚠', bgColor: 'bg-amber-50', textColor: 'text-amber-700', dotColor: 'bg-amber-500' },
  critical: { label: 'Hết hàng', bgColor: 'bg-red-50', textColor: 'text-red-700', dotColor: 'bg-red-500' },
}

function getStickyRowBackground(status: 'normal' | 'warning' | 'critical') {
  if (status === 'warning') return 'bg-amber-50/30 group-hover:bg-amber-50/40'
  if (status === 'critical') return 'bg-red-50/30 group-hover:bg-red-50/40'
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

export function InventoryTable({ model }: InventoryTableProps) {
  const isAllSelected = model.selectedRows.length === model.rows.length && model.rows.length > 0

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto overflow-y-hidden flex-1">
        <Table className="min-w-[1300px]">
        <TableHeader className="bg-indigo-50/50">
          <TableRow className="border-b border-slate-200 hover:bg-transparent">
            <TableHead className="w-12 min-w-12 sticky left-0 z-30 bg-indigo-50/80 backdrop-blur supports-[backdrop-filter]:bg-indigo-50/70">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => model.onSelectAll(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
            </TableHead>
            {model.columns.map((col) => (
              <TableHead
                key={col.id}
                className={`text-xs font-bold uppercase text-slate-600 tracking-wide ${
                  col.id === 'image'
                    ? 'w-16 min-w-16 sticky left-12 z-30 bg-indigo-50/80 backdrop-blur supports-[backdrop-filter]:bg-indigo-50/70'
                    : ''
                } ${
                  col.id === 'productName'
                    ? 'min-w-[260px] sticky left-28 z-30 bg-indigo-50/80 backdrop-blur supports-[backdrop-filter]:bg-indigo-50/70'
                    : ''
                } ${
                  col.id === 'sku' ? 'min-w-[140px]' : ''
                } ${
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                }`}
              >
                {col.label}
              </TableHead>
            ))}
            <TableHead className="text-right text-xs font-bold uppercase text-slate-600 min-w-[110px]">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {model.rows.map((row) => {
            const isSelected = model.selectedRows.includes(row.id)
            const statusInfo = statusConfig[row.status]

            return (
              <TableRow
                key={row.id}
                className={`group border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${
                  row.status === 'warning'
                    ? 'bg-amber-50/30'
                    : row.status === 'critical'
                      ? 'bg-red-50/30'
                      : ''
                }`}
              >
                <TableCell className={`sticky left-0 z-20 ${getStickyRowBackground(row.status)}`}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => model.onSelectRow(row.id)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </TableCell>
                {/* Render dynamic columns */}
                {model.columns.map((col) => {
                  if (col.id === 'image') {
                    return (
                      <TableCell key={col.id} className={`text-center py-3 sticky left-12 z-20 ${getStickyRowBackground(row.status)}`}>
                        {row.image ? (
                          <img
                            src={row.image}
                            alt={row.sku}
                            className="w-8 h-8 rounded object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-slate-100" />
                        )}
                      </TableCell>
                    )
                  } else if (col.id === 'sku') {
                    return (
                      <TableCell key={col.id} className="font-mono font-medium text-indigo-600 text-sm">
                        {row.sku}
                      </TableCell>
                    )
                  } else if (col.id === 'productName') {
                    return (
                      <TableCell key={col.id} className={`max-w-xs sticky left-28 z-20 ${getStickyRowBackground(row.status)}`}>
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
                      </TableCell>
                    )
                  } else if (col.id === 'category') {
                    return (
                      <TableCell key={col.id} className="text-slate-600 text-sm">
                        {row.category}
                      </TableCell>
                    )
                  } else if (col.id === 'marketplaceStock') {
                    const marketplaceTotal = row.shopeeStock + row.tiktokStock + row.lazadaStock

                    return (
                      <TableCell key={col.id} className="text-right font-mono text-sm text-slate-900">
                        <button
                          type="button"
                          title={`Chi tiết tồn trên sàn\nShopee: ${row.shopeeStock}\nTikTok: ${row.tiktokStock}\nLazada: ${row.lazadaStock}`}
                          className="rounded px-1.5 py-0.5 hover:bg-slate-100"
                        >
                          {marketplaceTotal}
                        </button>
                      </TableCell>
                    )
                  } else if (col.id === 'actualStock') {
                    return (
                      <TableCell key={col.id}>
                        <div className="text-right">
                          <p className="font-mono font-medium text-sm text-slate-900">{row.actualStock}</p>
                          <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden mt-1 ml-auto">
                            <div
                              className={`h-full ${
                                row.status === 'normal'
                                  ? 'bg-emerald-500'
                                  : row.status === 'warning'
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min((row.actualStock / 100) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                    )
                  } else if (col.id === 'onOrder') {
                    return (
                      <TableCell key={col.id} className="text-right font-mono text-slate-500 text-sm">
                        {row.onOrder}
                      </TableCell>
                    )
                  } else if (col.id === 'available') {
                    return (
                      <TableCell key={col.id} className="text-right font-mono text-sm text-slate-900">
                        {row.available}
                      </TableCell>
                    )
                  } else if (col.id === 'status') {
                    return (
                      <TableCell key={col.id}>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`} />
                          <span className={`text-xs font-medium ${statusInfo.textColor}`}>{statusInfo.label}</span>
                        </div>
                      </TableCell>
                    )
                  } else if (col.id === 'forecast') {
                    const forecast = getForecastMeta(row.restockDays)

                    return (
                      <TableCell key={col.id} className="text-sm">
                        <span
                          title={forecast.description}
                          className={`inline-flex items-center rounded-md px-2 py-0.5 font-medium ${forecast.bgClass} ${forecast.textClass}`}
                        >
                          {row.restockDays || '-'}
                        </span>
                      </TableCell>
                    )
                  }
                  return null
                })}
                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" className="p-1 hover:bg-slate-100 rounded">
                      <Edit2 className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-slate-100 rounded"
                      onClick={(event) => {
                        event.stopPropagation()
                        model.onOpenProductDetail?.(row.id, row.productId)
                      }}
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
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
