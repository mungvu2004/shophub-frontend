import { useMemo, useState, useCallback, memo } from 'react'
import type { Product } from '@/types/product.types'
import { DataTable, type DataTableColumn } from '@/components/shared/DataTable'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2, Edit, ChevronRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLATFORM_CONFIG } from '../../constants/platformConfig'

interface ProductsTableProps {
  products: Product[]
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onViewVariants?: (product: Product) => void
  onSelectionChange?: (selectedIds: string[]) => void
}

const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A//www.w3.org/2000/svg%22 width%3D%2248%22 height%3D%2248%22 viewBox%3D%220 0 48 48%22%3E%3Crect width%3D%2248%22 height%3D%2248%22 rx%3D%228%22 fill%3D%22%23f1f5f9%22/%3E%3C/svg%3E'

/**
 * Premium SVG Sparkline with smooth Bezier curves and high-fidelity area gradient
 */
const Sparkline = memo(({ data, color }: { data: { value: number }[], color: string }) => {
  if (!data || data.length < 2) return <div className="h-6 w-16" />
  
  const min = Math.min(...data.map(d => d.value))
  const max = Math.max(...data.map(d => d.value))
  const range = max - min || 1
  const width = 64
  const height = 24
  
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d.value - min) / range) * height
  }))

  let pathData = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const cp1x = points[i].x + (points[i+1].x - points[i].x) / 2
    const cp1y = points[i].y
    const cp2x = points[i].x + (points[i+1].x - points[i].x) / 2
    const cp2y = points[i+1].y
    pathData += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i+1].x} ${points[i+1].y}`
  }

  const fillPath = `${pathData} L ${width} ${height} L 0 ${height} Z`
  const gradientId = `gradient-${color.replace('#', '')}`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto overflow-visible group-hover:scale-110 transition-transform duration-500">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="40%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradientId})`} />
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
})

Sparkline.displayName = 'Sparkline'

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  onViewVariants,
  onSelectionChange,
}: ProductsTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const [prevProducts, setPrevProducts] = useState(products)
  if (products !== prevProducts) {
    setPrevProducts(products)
    const validIds = new Set(products.map((p) => p.id))
    setSelectedRows((prev) => {
      const filtered = new Set([...prev].filter((id) => validIds.has(id)))
      if (filtered.size !== prev.size) {
         return filtered
      }
      return prev
    })
  }

  const toggleRow = useCallback((productId: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(productId)) next.delete(productId)
      else next.add(productId)
      onSelectionChange?.([...next])
      return next
    })
  }, [onSelectionChange])

  const toggleAllRows = useCallback(() => {
    setSelectedRows((prev) => {
      const next = prev.size === products.length ? new Set<string>() : new Set(products.map((p) => p.id))
      onSelectionChange?.([...next])
      return next
    })
  }, [products, onSelectionChange])

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
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              aria-label="Chọn tất cả sản phẩm"
              checked={selectedRows.size === products.length && products.length > 0}
              onChange={toggleAllRows}
              className="size-3.5 rounded-md border-slate-300 accent-primary cursor-pointer transition-all hover:scale-110"
            />
          </div>
        ),
        widthClassName: 'w-10',
        cell: (product) => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              aria-label={`Chọn sản phẩm ${product.name}`}
              checked={selectedRows.has(product.id)}
              onClick={(e) => e.stopPropagation()}
              onChange={() => toggleRow(product.id)}
              className="size-3.5 rounded-md border-slate-300 accent-primary cursor-pointer transition-all hover:scale-110"
            />
          </div>
        ),
      },
      {
        id: 'product',
        header: 'Sản phẩm',
        widthClassName: 'w-[320px]',
        sortable: true,
        accessor: 'name',
        cell: (product) => {
          const variant = product.variants?.[0]
          const isExpanded = expandedRows.has(product.id)
          
          const platforms = new Set<string>()
          product.variants?.forEach(v => {
             v.listings?.forEach(l => platforms.add(l.platform))
          })

          return (
            <div className="flex items-center gap-4 group/item">
              <div className="relative shrink-0">
                <img
                  src={variant?.mainImageUrl || FALLBACK_IMAGE}
                  alt={product.name}
                  loading="lazy"
                  decoding="async"
                  className="size-11 rounded-xl object-cover border border-slate-100 shadow-sm transition-transform group-hover/item:scale-105"
                />
                <div className="absolute -bottom-1 -right-1 flex -space-x-1.5">
                   {Array.from(platforms).map(p => (
                     <div key={p} className={cn("size-3 rounded-full border-2 border-white shadow-xs", PLATFORM_CONFIG[p]?.color || "bg-slate-400")} />
                   ))}
                </div>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-xs text-slate-900 leading-tight truncate tracking-tight">{product.name}</p>
                <div className="flex items-center gap-2 mt-1">
                   <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                     {variant?.internalSku || 'NO-SKU'}
                   </span>
                   {product.variants && product.variants.length > 1 && (
                     <button 
                       onClick={(e) => { e.stopPropagation(); toggleVariants(product.id) }}
                       aria-expanded={isExpanded}
                       className={cn(
                         "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase transition-all",
                         isExpanded ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                       )}
                     >
                       {product.variants.length} Phân loại
                       <ChevronRight className={cn("size-2.5 transition-transform", isExpanded && "rotate-90")} />
                     </button>
                   )}
                </div>
              </div>
            </div>
          )
        },
      },
      {
        id: 'price',
        header: 'Giá bán',
        align: 'right',
        widthClassName: 'w-28',
        sortable: true,
        sortAccessor: (p) => p.variants?.[0]?.salePrice ?? 0,
        cell: (product) => (
          <div className="flex flex-col items-end">
            <p className="font-mono text-[13px] font-black text-slate-900">
              {(product.variants?.[0]?.salePrice ?? 0).toLocaleString('vi-VN')}
              <span className="ml-0.5 text-[10px] text-slate-400 font-normal">₫</span>
            </p>
            <div className="flex items-center gap-1 mt-0.5">
               <span className="text-[9px] font-bold text-emerald-500">+{product.margin || 0}%</span>
               <span className="text-[8px] text-slate-300 font-bold uppercase">Margin</span>
            </div>
          </div>
        ),
      },
      {
        id: 'performance',
        header: 'Hiệu suất',
        align: 'center',
        widthClassName: 'w-28',
        cell: (product) => {
          const data = product.trendData || []
          const isUp = data.length > 1 ? data[data.length - 1].value >= data[0].value : true
          const color = isUp ? '#10b981' : '#f43f5e'
          
          return (
            <div className="flex flex-col items-center gap-1">
               <Sparkline data={data} color={color} />
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">30 ngày</p>
            </div>
          )
        },
      },
      {
        id: 'quality',
        header: 'Listing',
        align: 'center',
        widthClassName: 'w-24',
        sortable: true,
        sortAccessor: (p) => p.qualityScore || 0,
        cell: (product) => {
          const score = product.qualityScore || 0
          const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-rose-500"
          return (
            <div className="flex flex-col items-center gap-1">
               <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                 <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: `${score}%` }} />
               </div>
               <span className="text-[10px] font-black text-slate-700">{score}%</span>
            </div>
          )
        },
      },
      {
        id: 'inventory',
        header: 'Tồn kho',
        align: 'center',
        widthClassName: 'w-24',
        sortable: true,
        sortAccessor: (p) => p.stock || 0,
        cell: (product) => {
          const stock = product.stock || 0
          const isLow = stock < 50
          return (
            <div className="flex flex-col items-center">
              <span className={cn("font-mono text-sm font-black", isLow ? "text-rose-500" : "text-slate-900")}>
                {stock}
              </span>
              {isLow && (
                <span className="text-[8px] font-black text-rose-500 uppercase tracking-tighter">Sắp hết</span>
              )}
            </div>
          )
        },
      },
      {
        id: 'status',
        header: 'Trạng thái',
        align: 'center',
        widthClassName: 'w-24',
        sortable: true,
        accessor: 'status',
        cell: (product) => {
          const colors: Record<string, string> = {
            Active: 'text-emerald-600 bg-emerald-50 border-emerald-100/50',
            Inactive: 'text-slate-500 bg-slate-50 border-slate-200/50',
            Deleted: 'text-rose-600 bg-rose-50 border-rose-100/50',
          }
          return (
            <span className={cn(
              "inline-flex items-center justify-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold w-20",
              colors[product.status] || colors.Inactive
            )}>
              <div className="size-1 rounded-full bg-current animate-pulse" />
              {product.status === 'Active' ? 'Đang bán' : product.status === 'Deleted' ? 'Hết hàng' : 'Tạm dừng'}
            </span>
          )
        },
      },
      {
        id: 'actions',
        header: '',
        align: 'right',
        widthClassName: 'w-20',
        cell: (product) => (
          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
            <Button
              variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 active:scale-90"
              onClick={(e) => { e.stopPropagation(); onEdit?.(product) }}
              aria-label={`Chỉnh sửa ${product.name}`}
            >
              <Edit className="size-3.5" />
            </Button>
            <Button
              variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-90"
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm('Xoá sản phẩm này?')) onDelete?.(product)
              }}
              aria-label={`Xoá ${product.name}`}
            >
              <Trash2 className="size-3.5" />
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
      rowClassName="group h-[68px] border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
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



