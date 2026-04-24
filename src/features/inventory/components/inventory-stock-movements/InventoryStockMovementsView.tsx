import type { InventoryStockMovementsViewModel } from '@/features/inventory/logic/inventoryStockMovements.types'
import { Pagination } from '@/components/ui/pagination'
import { useState } from 'react'

import { InventoryStockMovementsFilters } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementsFilters'
import { InventoryStockMovementsHeader } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementsHeader'
import { InventoryStockMovementsSidebar } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementsSidebar'
import { InventoryStockMovementsSummaryCards } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementsSummaryCards'
import { InventoryStockMovementsTimeline } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementsTimeline'
import { StockMovementsChart } from '@/features/inventory/components/inventory-stock-movements/StockMovementsChart'
import { InventoryStockMovementDetailDrawer } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementDetailDrawer'

type InventoryStockMovementsViewProps = {
  model: InventoryStockMovementsViewModel
  isRefreshing: boolean
  onSearchChange: (value: string) => void
  onPlatformChange: (value: InventoryStockMovementsViewModel['query']['platform']) => void
  onMovementGroupChange: (value: InventoryStockMovementsViewModel['query']['movementGroup']) => void
  onWarehouseChange: (value: string) => void
  onPerformerChange: (value: string) => void
  onRefresh: () => void
  onExport: () => void
  selectedMovementId: string | null
  onSelectMovement: (movementId: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function InventoryStockMovementsView({
  model,
  isRefreshing,
  onSearchChange,
  onPlatformChange,
  onMovementGroupChange,
  onWarehouseChange,
  onPerformerChange,
  onRefresh,
  onExport,
  selectedMovementId,
  onSelectMovement,
  onPageChange,
  onPageSizeChange,
}: InventoryStockMovementsViewProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSelect = (id: string) => {
    onSelectMovement(id);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-8 pt-1">
      <InventoryStockMovementsHeader
        title={model.title}
        subtitle={model.subtitle}
        updatedAtLabel={model.updatedAtLabel}
        suggestedActionLabel={model.suggestedActionLabel}
        onRefresh={onRefresh}
        onExport={onExport}
        isRefreshing={isRefreshing}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
           <StockMovementsChart data={model.chartData} />
        </div>
        <div className="xl:col-span-4">
           <InventoryStockMovementsSummaryCards cards={model.summaryCards} />
        </div>
      </div>

      <InventoryStockMovementsFilters
        search={model.query.search}
        platform={model.query.platform}
        movementGroup={model.query.movementGroup}
        warehouseId={model.query.warehouseId}
        performerId={model.query.performerId}
        platformOptions={model.platformOptions}
        groupOptions={model.groupOptions}
        warehouseOptions={model.warehouseOptions}
        performerOptions={model.performerOptions}
        onSearchChange={onSearchChange}
        onPlatformChange={onPlatformChange}
        onMovementGroupChange={onMovementGroupChange}
        onWarehouseChange={onWarehouseChange}
        onPerformerChange={onPerformerChange}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <div className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-100 bg-white px-5 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Dòng sự kiện</p>
              <p className="mt-1 text-sm text-slate-500">Mỗi card là một lần nhập, xuất hoặc điều chỉnh tồn kho.</p>
            </div>
            <div className="flex items-center gap-2">
              {isRefreshing ? <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Đang đồng bộ...</span> : null}
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-[#3525cd]">{model.totalCount} sự kiện</span>
            </div>
          </div>

          <InventoryStockMovementsTimeline
            groups={model.movementGroups}
            selectedMovementId={selectedMovementId}
            onSelectMovement={handleSelect}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-slate-100 bg-white px-5 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
            <p className="text-sm text-slate-500">
              Hiển thị {(model.page - 1) * model.pageSize + 1}-{Math.min(model.page * model.pageSize, model.totalCount)} trên tổng số {model.totalCount} biến động
            </p>

            <Pagination
              currentPage={model.page}
              totalCount={model.totalCount}
              pageSize={model.pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              pageSizeOptions={[8, 12, 24]}
              compact
            />
          </div>
        </div>

        <div className="xl:col-span-4">
          <InventoryStockMovementsSidebar
            selectedMovement={model.selectedMovement}
            platformStats={model.platformStats}
            warehouseStats={model.warehouseStats}
            lazadaNote={model.lazadaNote}
          />
        </div>
      </section>

      <InventoryStockMovementDetailDrawer 
        movement={model.selectedMovement}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  )
}
