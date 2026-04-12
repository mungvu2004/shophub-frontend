import { Pagination } from '@/components/ui/pagination'
import { InventoryGridCard } from '@/features/inventory/components/inventory-grid/InventoryGridCard'
import type { InventoryGridViewModel } from '@/features/inventory/logic/inventoryGrid.types'

type InventoryGridProps = {
  model: InventoryGridViewModel
}

export function InventoryGrid({ model }: InventoryGridProps) {
  const normalRows = model.rows.filter((row) => row.status === 'normal')
  const lowRows = model.rows.filter((row) => row.status === 'warning' || row.status === 'critical')

  return (
    <div className="space-y-12 pt-2">
      {model.rows.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <div className="text-center">
            <p className="font-medium text-slate-600">Không có sản phẩm</p>
            <p className="mt-1 text-sm text-slate-500">Thử thay đổi bộ lọc</p>
          </div>
        </div>
      ) : (
        <>
          {normalRows.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-2 rounded-full bg-indigo-700" />
                <h3 className="text-[18px] font-bold uppercase tracking-[-0.01em] text-slate-900">
                  Tồn kho bình thường
                </h3>
                <span className="text-sm font-medium text-slate-400">{normalRows.length} sản phẩm</span>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {normalRows.map((row) => (
                  <InventoryGridCard
                    key={row.id}
                    row={row}
                    variant="normal"
                    onAction={model.onCardAction}
                    onOpenProductDetail={model.onOpenProductDetail}
                  />
                ))}
              </div>
            </section>
          )}

          {lowRows.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-6 w-2 rounded-full bg-amber-600" />
                <h3 className="text-[18px] font-bold uppercase tracking-[-0.01em] text-slate-900">
                  Tồn kho thấp (Cần nhập ngay)
                </h3>
                <span className="text-sm font-medium text-slate-400">{lowRows.length} sản phẩm</span>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {lowRows.map((row) => (
                  <InventoryGridCard
                    key={row.id}
                    row={row}
                    variant="low"
                    onAction={model.onCardAction}
                    onOpenProductDetail={model.onOpenProductDetail}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Pagination */}
      {model.rows.length > 0 && (
        <Pagination
          currentPage={model.currentPage}
          totalCount={model.totalCount}
          pageSize={model.pageSize}
          onPageChange={model.onPageChange}
          onPageSizeChange={model.onPageSizeChange}
          pageSizeOptions={model.pageSizeOptions}
        />
      )}
    </div>
  )
}
