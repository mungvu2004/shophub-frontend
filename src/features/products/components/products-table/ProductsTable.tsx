import { Fragment, useEffect, useMemo, useState } from 'react'
import type { Product } from '@/types/product.types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2, Edit } from 'lucide-react'

interface ProductsTableProps {
  products: Product[]
  isLoading?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onViewVariants?: (product: Product) => void
  onSelectionChange?: (selectedIds: string[]) => void
}

// Helper to calculate mock metrics based on product ID
// Using underscore prefix to indicate intentionally unused parameter
const calculateMetrics = (_productId: string) => {
  const seed = Number((_productId.match(/\d+/)?.[0] ?? '1'))

  return {
    stock: (seed * 7) % 180 + 20,
    sold: (seed * 11) % 280 + 40,
    revenue: ((seed * 13) % 120 + 20) * 1000000,
  }
}

const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%2248%22 height%3D%2248%22 viewBox%3D%220 0 48 48%22%3E%3Crect width%3D%2248%22 height%3D%2248%22 rx%3D%228%22 fill%3D%22%23e2e8f0%22/%3E%3Ctext x%3D%2250%25%22 y%3D%2252%25%22 text-anchor%3D%22middle%22 dominant-baseline%3D%22middle%22 font-family%3D%22Arial%22 font-size%3D%2210%22 font-weight%3D%22700%22 fill%3D%22%2364758b%22%3ENo+Image%3C/text%3E%3C/svg%3E'

export function ProductsTable({
  products,
  isLoading,
  onEdit,
  onDelete,
  onViewVariants,
  onSelectionChange,
}: ProductsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  useEffect(() => {
    const validIds = new Set(products.map((p) => p.id))
    setSelectedRows((prev) => new Set([...prev].filter((id) => validIds.has(id))))
  }, [products])

  useEffect(() => {
    onSelectionChange?.([...selectedRows])
  }, [selectedRows, onSelectionChange])

  const trendByProduct = useMemo(() => {
    return products.reduce<Record<string, { points: string; color: string }>>((acc, product) => {
      const seed = Number((product.id.match(/\d+/)?.[0] ?? '1'))
      const patterns = [
        '2,18 10,15 18,19 26,10 34,13 42,6 50,8 58,4',
        '2,8 10,10 18,7 26,14 34,11 42,16 50,13 58,11',
        '2,16 10,12 18,14 26,9 34,10 42,7 50,9 58,5',
        '2,12 10,14 18,13 26,15 34,11 42,13 50,10 58,12',
      ]
      const colors = ['text-indigo-500', 'text-emerald-500', 'text-amber-500', 'text-violet-500']

      acc[product.id] = {
        points: patterns[seed % patterns.length],
        color: colors[seed % colors.length],
      }

      return acc
    }, {})
  }, [products])

  const toggleRow = (productId: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelectedRows(newSelected)
  }

  const toggleAllRows = () => {
    if (selectedRows.size === products.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(products.map((p) => p.id)))
    }
  }

  const toggleVariants = (productId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })
  }

  if (isLoading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Không có sản phẩm nào</p>
      </div>
    )
  }

  return (
    <div className="border rounded-2xl overflow-hidden bg-white">
      <Table className="text-sm" disableScroll>
        <TableHeader className="bg-[rgba(240,243,255,0.3)] border-b border-slate-100">
          <TableRow className="hover:bg-transparent border-b-0">
            <TableHead className="w-16 px-6 py-7">
              <input
                type="checkbox"
                checked={selectedRows.size === products.length && products.length > 0}
                onChange={toggleAllRows}
                className="size-4 rounded-md border border-slate-300 align-middle accent-indigo-600"
              />
            </TableHead>
            <TableHead className="w-16 px-2 py-7 text-[10px] uppercase tracking-[0.5px] font-extrabold text-slate-400">Ảnh</TableHead>
            <TableHead className="w-[210px] px-4 py-4 text-[10px] uppercase tracking-[0.5px] font-extrabold text-slate-400">Tên sản phẩm & SKU</TableHead>
            <TableHead className="w-24 px-4 py-6 text-center text-[10px] uppercase tracking-[0.5px] font-extrabold text-slate-400">Danh mục</TableHead>
            <TableHead className="w-[108px] px-4 py-7 text-right text-[10px] uppercase tracking-[0.5px] font-extrabold text-slate-400">Giá bán</TableHead>
            <TableHead className="w-16 px-4 py-6 text-center text-[10px] uppercase tracking-[0.5px] font-extrabold text-slate-400">Tồn kho</TableHead>
            <TableHead className="w-[70px] px-4 py-4 text-center text-[10px] uppercase tracking-[0.5px] font-extrabold text-slate-400">Đã bán (30N)</TableHead>
            <TableHead className="w-[148px] px-4 py-6 text-right text-[10px] uppercase tracking-[0.5px] font-extrabold text-slate-400">Doanh thu (30n)</TableHead>
            <TableHead className="w-[92px] px-4 py-6 text-center text-[10px] uppercase tracking-[0.5px] font-extrabold text-slate-400">Xu hướng</TableHead>
            <TableHead className="w-[72px] px-4 py-6 text-center text-[10px] uppercase tracking-[0.5px] font-extrabold text-slate-400">Đồng bộ</TableHead>
            <TableHead className="w-[106px] px-4 py-6 text-center text-[10px] uppercase tracking-[0.5px] font-extrabold text-slate-400">Trạng thái</TableHead>
            <TableHead className="w-[120px] px-6 py-7 text-right text-[10px] uppercase tracking-[0.5px] font-extrabold text-slate-400">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const variant = product.variants?.[0]
            const metrics = calculateMetrics(product.id)
            const lastSynced = variant?.listings?.[0]?.lastSyncedAt
            const isRecent = lastSynced && new Date(lastSynced).getTime() > Date.now() - 60000
            const isExpanded = expandedRows.has(product.id)

            const statusMap: Record<string, { label: string; color: string }> = {
              Active: { label: 'ĐANG\nBÁN', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
              Inactive: { label: 'TẠM\nDỪNG', color: 'bg-amber-50 text-amber-700 border-amber-100' },
              Deleted: { label: 'HẾT\nHÀNG', color: 'bg-red-50 text-red-700 border-red-100' },
            }
            const statusInfo = statusMap[product.status] || {
              label: product.status,
              color: 'bg-gray-100 text-gray-700 border-gray-200',
            }

            return (
              <Fragment key={product.id}>
                <TableRow
                  className="group border-slate-100 h-[116px] hover:bg-slate-50/30 cursor-pointer"
                  onClick={() => onViewVariants?.(product)}
                >
                <TableCell className="px-6 py-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(product.id)}
                    onClick={(event) => event.stopPropagation()}
                    onChange={() => toggleRow(product.id)}
                    className="size-[18px] rounded-md border border-slate-300 align-middle accent-indigo-600"
                  />
                </TableCell>
                <TableCell className="px-2 py-8">
                  {variant?.mainImageUrl ? (
                    <img
                      src={variant.mainImageUrl}
                      alt={product.name}
                      className="size-12 rounded-lg object-cover bg-[#e7eeff]"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = FALLBACK_IMAGE
                      }}
                    />
                  ) : (
                    <div className="size-12 rounded-lg bg-[#e7eeff]" />
                  )}
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="space-y-0.5">
                    <p className="font-bold text-[14px] leading-5 text-[#111c2d] max-w-[150px] whitespace-normal">
                      {product.name}
                    </p>
                    {variant && (
                      <p className="text-[11px] text-slate-400 font-mono uppercase leading-[1.2]">
                        {variant.internalSku}
                      </p>
                    )}
                    {product.variants && product.variants.length > 1 && (
                      <button
                        type="button"
                        className="text-[10px] text-indigo-700 font-bold leading-[1.2] hover:underline"
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleVariants(product.id)
                        }}
                      >
                        {isExpanded ? '▼' : '▶'} {product.variants.length} phân loại
                      </button>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-9 text-center">
                  <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                    {product.brand || 'N/A'}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-9 text-right">
                  <p className="font-mono font-bold text-[14px] leading-5 text-[#111c2d]">
                    {(variant?.salePrice ?? 0).toLocaleString('vi-VN')} ₫
                  </p>
                </TableCell>
                <TableCell className="px-4 py-7 text-center">
                  <p className="font-bold text-emerald-600 text-xs leading-4">{metrics.stock}</p>
                  <p className="text-[10px] text-slate-400 leading-4">đv</p>
                </TableCell>
                <TableCell className="px-4 py-9 text-center">
                  <p className="text-[14px] leading-5 font-mono text-[#111c2d]">{metrics.sold}</p>
                </TableCell>
                <TableCell className="w-[148px] px-4 py-6 text-right">
                  <p className="font-mono font-bold text-[14px] leading-5 text-indigo-600">
                    {Math.round(metrics.revenue).toLocaleString('vi-VN')}
                  </p>
                  <p className="font-mono font-bold text-[14px] leading-5 text-indigo-600">₫</p>
                </TableCell>
                <TableCell className="px-4 py-8 text-center">
                  <svg
                    viewBox="0 0 60 24"
                    className={`mx-auto h-6 w-[60px] ${trendByProduct[product.id]?.color ?? 'text-indigo-500'}`}
                  >
                    <polyline
                      points={trendByProduct[product.id]?.points ?? '2,18 10,15 18,19 26,10 34,13 42,6 50,8 58,4'}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </TableCell>
                <TableCell className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className={`h-2 w-1 rounded-full ${isRecent ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                    <span className="text-[10px] text-slate-600 leading-[1.1] text-left">
                      {isRecent ? (
                        <>
                          Đã<br />đồng<br />bộ
                        </>
                      ) : (
                        <>
                          Đang<br />đồng<br />bộ
                        </>
                      )}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-7 text-center">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold tracking-[0.5px] ${statusInfo.color}`}>
                    <span className="h-2 w-1 rounded-full bg-current opacity-70" />
                    <span className="whitespace-pre text-left leading-[1.1]">{statusInfo.label}</span>
                  </span>
                </TableCell>
                <TableCell className="px-6 py-8 text-right">
                  <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(event) => {
                          event.stopPropagation()
                          onEdit(product)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(event) => {
                          event.stopPropagation()
                          onDelete(product)
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
                </TableRow>

                {isExpanded && product.variants && product.variants.length > 1 && (
                  <TableRow className="bg-indigo-50/30 border-slate-100">
                    <TableCell colSpan={12} className="px-8 py-4">
                      <div className="rounded-xl border border-indigo-100 bg-white p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-slate-500">Danh sách biến thể</p>
                          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                            {product.variants.length} biến thể
                          </span>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                          {product.variants.map((item) => {
                            const itemStatusClass =
                              item.status === 'Active'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-amber-200 bg-amber-50 text-amber-700'

                            return (
                              <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50/60 p-2.5">
                                <div className="mb-1.5 flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className="truncate text-xs font-semibold text-slate-800">{item.name || 'Biến thể mặc định'}</p>
                                    <p className="truncate font-mono text-[10px] uppercase text-slate-400">{item.internalSku}</p>
                                  </div>
                                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${itemStatusClass}`}>
                                    {item.status === 'Active' ? 'Đang bán' : 'Tạm dừng'}
                                  </span>
                                </div>

                                <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-500">
                                  <p className="col-span-2">Giá</p>
                                  <p className="text-right">Sàn</p>
                                  <p className="col-span-2 font-mono text-xs font-bold text-slate-800">
                                    {(item.salePrice ?? item.basePrice ?? 0).toLocaleString('vi-VN')} ₫
                                  </p>
                                  <p className="text-right text-xs font-semibold text-indigo-600">{item.listings?.length ?? 0}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
