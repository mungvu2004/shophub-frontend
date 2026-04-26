import { ArrowLeftRight, Search } from 'lucide-react'
import type { InventoryStockMovementsViewModel } from '@/features/inventory/logic/inventoryStockMovements.types'
import { Pagination } from '@/components/ui/pagination'
import { useState } from 'react'

import { InventoryStockMovementsHeader } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementsHeader'
import { InventoryStockMovementsFilters } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementsFilters'
import { InventoryStockMovementsSidebar } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementsSidebar'
import { InventoryStockMovementsSummaryCards } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementsSummaryCards'
import { InventoryStockMovementsTimeline } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementsTimeline'
import { StockMovementsChart } from '@/features/inventory/components/inventory-stock-movements/StockMovementsChart'
import { InventoryStockMovementDetailDrawer } from '@/features/inventory/components/inventory-stock-movements/InventoryStockMovementDetailDrawer'
import { StockMovementActionButtons } from '@/features/inventory/components/inventory-stock-movements/StockMovementActionButtons'
import { CreateMovementDialog } from '@/features/inventory/components/inventory-stock-movements/CreateMovementDialog'
import type { useCreateMovement } from '@/features/inventory/hooks/useCreateMovement'

interface InventoryStockMovementsViewProps {
  model: InventoryStockMovementsViewModel & { 
    chartData: any[]; 
    performerOptions: any[];
  }
  isRefreshing: boolean
  onSearchChange: (value: string) => void
  onPlatformChange: (value: any) => void
  onMovementGroupChange: (value: any) => void
  onWarehouseChange: (value: string) => void
  onPerformerChange: (value: string) => void
  onRefresh: () => void
  onExport: () => void
  selectedMovementId: string | null
  onSelectMovement: (movementId: string) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  createMovementController: ReturnType<typeof useCreateMovement>
}

function TimelineHeader({ count, isRefreshing }: { count: number; isRefreshing: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-slate-100 bg-white px-5 py-3 shadow-sm">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Dòng sự kiện</p>
      </div>
      <div className="flex items-center gap-2">
        {isRefreshing ? <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold text-amber-700 uppercase tracking-wider">Đồng bộ...</span> : null}
        <span className="rounded-full bg-primary-50 px-3 py-1 text-[10px] font-bold text-primary-700 uppercase tracking-wider">{count} sự kiện</span>
      </div>
    </div>
  )
}

function EmptyTimelineState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
      <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <Search className="size-6 text-slate-300" />
      </div>
      <h3 className="text-sm font-bold text-slate-900">Không tìm thấy biến động kho</h3>
      <p className="text-xs text-slate-400 mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
    </div>
  )
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
  createMovementController,
}: InventoryStockMovementsViewProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSelect = (id: string) => {
    onSelectMovement(id);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-5 pb-8 pt-1">
      <InventoryStockMovementsHeader
        title={model.title}
        subtitle={model.subtitle}
        updatedAtLabel={model.updatedAtLabel}
        suggestedActionLabel={model.suggestedActionLabel}
        onRefresh={onRefresh}
        onExport={onExport}
        onQuickImport={createMovementController.openImport}
        onQuickExport={createMovementController.openExport}
        isRefreshing={isRefreshing}
      />

      {/* Filters Section */}
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

      {/* Charts & Summary */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 xl:col-span-8">
           <StockMovementsChart data={model.chartData} />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
           <InventoryStockMovementsSummaryCards cards={model.summaryCards} />
        </div>
      </div>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="space-y-5 xl:col-span-8">
          <TimelineHeader count={model.totalCount} isRefreshing={isRefreshing} />

          <InventoryStockMovementsTimeline
            groups={model.movementGroups}
            selectedMovementId={selectedMovementId}
            onSelectMovement={handleSelect}
          />

          {model.movementGroups.length === 0 && !isRefreshing && <EmptyTimelineState />}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[32px] border border-slate-100 bg-white px-6 py-4 shadow-sm">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Hiển thị {(model.page - 1) * model.pageSize + 1}-{Math.min(model.page * model.pageSize, model.totalCount)} / {model.totalCount} biến động
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

      <CreateMovementDialog controller={createMovementController} />
    </div>
  )
}
