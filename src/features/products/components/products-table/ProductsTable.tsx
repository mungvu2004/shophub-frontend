import { useEffect, useMemo, useState, useCallback } from 'react'
import type { Product } from '@/types/product.types'
import { DataTable, type DataTableColumn } from '@/components/shared/DataTable'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2, Edit, ChevronRight, ExternalLink } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

interface ProductsTableProps {
  products: Product[]
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onViewVariants?: (product: Product) => void
  onSelectionChange?: (selectedIds: string[]) => void
}

const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%2248%22 height%3D%2248%22 viewBox%3D%220 0 48 48%22%3E%3Crect width%3D%2248%22 height%3D%2248%22 rx%3D%228%22 fill%3D%22%23f1f5f9%22/%3E%3C/svg%3E'

export function ProductsTable({
  products,
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

  const toggleRow = useCallback((productId: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) next.delete(productId)
      else next.add(productId)
      return next
    })
  }, [])

  const toggleAllRows = useCallback(() => {
    setSelectedRows((prev) => {
      if (prev.size === products.length) return new Set()
      return new Set(products.map((p) => p.id))
    })
  }, [products])

  const toggleVariants = useCallback((productId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) next.delete(productId)
      else next.add(productId)
      return next
    })
  }, [])

  const columns = useMemo<DataTableColumn<Product>[]>(
    () => [
      {
        id: 'select',
        header: (
          <input
            type="checkbox"
            aria-label="Chọn tất cả sản phẩm"
            checked={selectedRows.size === products.length && products.length > 0}
            onChange={toggleAllRows}
            className="size-4 rounded border-slate-300 accent-slate-900 cursor-pointer"
          />
        ),
        widthClassName: 'w-12',
        cell: (product) => (
          <input
            type="checkbox"
            aria-label={`Chọn sản phẩm ${product.name}`}
            checked={selectedRows.has(product.id)}
            onClick={(e) => e.stopPropagation()}
            onChange={() => toggleRow(product.id)}
            className="size-4 rounded border-slate-300 accent-slate-900 cursor-pointer"
          />
        ),
      },
      {
        id: 'product',
        header: 'Sản phẩm',
        widthClassName: 'w-[340px]',
        sortable: true,
        accessor: 'name',
        cell: (product) => {
          const variant = product.variants?.[0]
          const isExpanded = expandedRows.has(product.id)
          
          // Extract unique platforms
          const platforms = new Set<string>()
          product.variants?.forEach(v => {
             v.listings?.forEach(l => platforms.add(l.platform))
          })
          const platformColors: Record<string, string> = { shopee: 'bg-orange-500', tiktok_shop: 'bg-slate-900', lazada: 'bg-indigo-600' }

          return (
            <div className="flex items-center gap-3">
              <img
                src={variant?.mainImageUrl || FALLBACK_IMAGE}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="size-12 rounded-xl object-cover border border-slate-200 bg-slate-50"
              />
              <div className="min-w-0">
                <p className="font-bold text-sm text-slate-900 leading-none truncate">{product.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                   <span className="font-mono text-[10px] font-bold text-slate-600 uppercase tracking-tight">{variant?.internalSku || 'SKU-NONE'}</span>
                   {platforms.size > 0 && (
                     <div className="flex -space-x-1">
                       {Array.from(platforms).map(p => (
                         <div key={p} className={cn("size-3 rounded-full border border-white", platformColors[p] || "bg-slate-400")} title={p} />
                       ))}
                     </div>
                   )}
                   {product.variants && product.variants.length > 1 && (
                     <button 
                       onClick={(e) => { e.stopPropagation(); toggleVariants(product.id) }}
                       className={cn(
                         "flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-all",
                         isExpanded ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                       )}
                     >
                       {product.variants.length} Phân loại
                       <ChevronRight className={cn("size-3 transition-transform", isExpanded && "rotate-90")} />
                     </button>
                   )}
                </div>
              </div>
            </div>
          )
        },
      },
      {
        id: 'category',
        header: 'Danh mục',
        align: 'center',
        widthClassName: 'w-28',
        sortable: true,
        accessor: 'brand',
        cell: (product) => (
          <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-600">
            {product.brand || 'Khác'}
          </span>
        ),
      },
      {
        id: 'price',
        header: 'Giá niêm yết',
        align: 'right',
        widthClassName: 'w-32',
        sortable: true,
        sortAccessor: (p) => p.variants?.[0]?.salePrice ?? 0,
        cell: (product) => (
          <div className="flex items-center justify-end w-full">
            <span className="font-mono text-sm font-bold text-slate-900">
              {(product.variants?.[0]?.salePrice ?? 0).toLocaleString('vi-VN')}
            </span>
            <span className="ml-1 text-xs font-semibold text-slate-500">₫</span>
          </div>
        ),
      },
      {
        id: 'margin',
        header: 'Biên LN',
        align: 'right',
        widthClassName: 'w-24',
        sortable: true,
        sortAccessor: (p) => p.margin || 0,
        cell: (product) => {
          const margin = product.margin || 0
          return (
            <span className="font-mono text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              +{margin}%
            </span>
          )
        },
      },
      {
        id: 'quality',
        header: 'Chất lượng',
        align: 'center',
        widthClassName: 'w-24',
        sortable: true,
        sortAccessor: (p) => p.qualityScore || 0,
        cell: (product) => {
          const score = product.qualityScore || 0
          const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-rose-500"
          return (
            <div className="w-full max-w-[60px] mx-auto group relative cursor-help" title={`Điểm chất lượng Listing: ${score}/100`}>
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${score}%` }} />
               </div>
               <p className="text-[9px] font-bold text-slate-400 text-center mt-1 group-hover:text-slate-700 transition-colors">{score}/100</p>
            </div>
          )
        },
      },
      {
        id: 'trend',
        header: 'Xu hướng',
        align: 'center',
        widthClassName: 'w-24',
        cell: (product) => {
          const data = product.trendData || Array.from({ length: 7 }).map(() => ({ value: 0 }))
          const isUp = data.length > 0 ? data[data.length - 1].value >= data[0].value : true
          const color = isUp ? '#10b981' : '#f43f5e'
          
          return (
            <div className="h-6 w-16 mx-auto opacity-80 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )
        },
      },
      {
        id: 'revenue',
        header: 'Doanh thu',
        align: 'right',
        widthClassName: 'w-32',
        sortable: true,
        sortAccessor: (p) => p.revenue || 0,
        cell: (product) => {
          const revenue = product.revenue || 0
          return (
            <div className="flex items-center justify-end w-full">
              <span className="font-mono text-sm font-bold text-slate-900">
                {revenue.toLocaleString('vi-VN')}
              </span>
              <span className="ml-1 text-xs font-semibold text-slate-500">₫</span>
            </div>
          )
        },
      },
      {
        id: 'stock',
        header: 'Kho',
        align: 'center',
        widthClassName: 'w-24',
        sortable: true,
        sortAccessor: (p) => p.stock || 0,
        cell: (product) => {
          const stock = product.stock || 0
          const sold = product.sold || 0
          const parLevel = 200
          const percentage = Math.min(100, Math.max(0, (stock / parLevel) * 100))
          
          let tag = null
          if (stock < 50) {
             tag = <span className="mt-1.5 inline-block text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded whitespace-nowrap">🔴 Sắp hết</span>
          } else if (sold < 100 && stock > 100) {
             tag = <span className="mt-1.5 inline-block text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded whitespace-nowrap">🟡 Tồn đọng</span>
          } else if (sold > 150) {
             tag = <span className="mt-1.5 inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded whitespace-nowrap">🟢 Bán chạy</span>
          }
          
          return (
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-1">
                <p className={cn("text-sm font-bold font-mono", stock < 50 ? "text-rose-600" : "text-slate-900")}>{stock}</p>
                <span className="text-[10px] text-slate-400 font-mono">/{parLevel}</span>
              </div>
              <div className="mt-1 w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                 <div className={cn("h-full rounded-full", stock < 50 ? "bg-rose-500" : "bg-emerald-500")} style={{ width: `${percentage}%` }} />
              </div>
              {tag}
            </div>
          )
        },
      },
      {
        id: 'status',
        header: 'Trạng thái',
        align: 'center',
        widthClassName: 'w-28',
        sortable: true,
        accessor: 'status',
        cell: (product) => {
          const colors: Record<string, string> = {
            Active: 'text-emerald-800 bg-emerald-100 border-emerald-200',
            Inactive: 'text-slate-700 bg-slate-100 border-slate-200',
            Deleted: 'text-rose-800 bg-rose-100 border-rose-200',
          }
          return (
            <span className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold w-24",
              colors[product.status] || colors.Inactive
            )}>
              <div className="size-1.5 rounded-full bg-current" />
              {product.status === 'Active' ? 'Đang bán' : product.status === 'Deleted' ? 'Hết hàng' : 'Tạm dừng'}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: '',
        align: 'right',
        widthClassName: 'w-24',
        cell: (product) => (
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-90"
              onClick={(e) => { e.stopPropagation(); onEdit?.(product) }}
              title="Chỉnh sửa sản phẩm"
            >
              <Edit className="size-4" />
            </Button>
            <Button
              variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-90"
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm('Xoá sản phẩm này?')) onDelete?.(product)
              }}
              title="Xoá sản phẩm"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [selectedRows, products.length, expandedRows, onEdit, onDelete, toggleAllRows, toggleRow, toggleVariants]
  )

  return (
    <DataTable
      rows={products}
      columns={columns}
      rowKey={(p) => p.id}
      disableScroll
      rowClassName="group h-[72px] border-b border-border hover:bg-muted/50 transition-colors"
      onRowClick={(p) => onViewVariants?.(p)}
      renderAfterRow={(product) => {
        if (!expandedRows.has(product.id)) return null
        return (
          <TableRow className="bg-muted/30 border-b border-border hover:bg-muted/30">
            <TableCell colSpan={columns.length} className="p-4">
              <div className="ml-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {product.variants?.map((v) => (
                  <div key={v.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 shadow-sm hover:border-primary/50 hover:shadow-md transition-all">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{v.name || 'Mặc định'}</p>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase mt-1">{v.internalSku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-foreground">{(v.salePrice || 0).toLocaleString()}₫</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                         <span className="text-[11px] font-semibold text-primary">{v.listings?.length || 0} sàn</span>
                         <ExternalLink className="size-3 text-primary/60" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TableCell>
          </TableRow>
        )
      }}
    />
  )
}



