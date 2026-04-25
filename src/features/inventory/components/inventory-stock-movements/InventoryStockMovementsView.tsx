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
    <div className="flex items-center justify-between gap-4 py-2 px-2">
      <div className="flex items-center gap-3">
        <div className="size-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-secondary-900">Dòng sự kiện</h2>
      </div>
      <div className="flex items-center gap-2">
        {isRefreshing && <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest animate-pulse">Đang đồng bộ...</span>}
        <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">{count} biến động kho</span>
      </div>
    </div>
  )
}

function EmptyTimelineState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[32px] border border-secondary-100 border-dashed transition-all hover:bg-secondary-50/30">
      <div className="size-20 bg-secondary-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <Search className="size-8 text-secondary-200" />
      </div>
      <h3 className="text-base font-bold text-secondary-900 italic underline decoration-primary-300 decoration-2 underline-offset-4">Không tìm thấy dữ liệu</h3>
      <p className="text-sm font-medium text-secondary-400 mt-3 max-w-xs text-center">Hãy thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại các bộ lọc ngày tháng.</p>
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
    <div className="space-y-12 pb-24 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out max-w-[1600px] mx-auto">
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

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
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
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 items-stretch animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
        <div className="xl:col-span-8">
           <StockMovementsChart data={model.chartData} />
        </div>
        <div className="xl:col-span-4">
           <InventoryStockMovementsSummaryCards cards={model.summaryCards} />
        </div>
      </div>

      <section className="grid grid-cols-1 gap-12 xl:grid-cols-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
        <div className="space-y-10 xl:col-span-8">
          <TimelineHeader count={model.totalCount} isRefreshing={isRefreshing} />

          <InventoryStockMovementsTimeline
            groups={model.movementGroups}
            selectedMovementId={selectedMovementId}
            onSelectMovement={handleSelect}
          />

          {model.movementGroups.length === 0 && !isRefreshing && <EmptyTimelineState />}

          <div className="flex flex-wrap items-center justify-between gap-6 px-4 pt-4">
            <p className="text-[10px] font-black text-secondary-300 uppercase tracking-[0.2em] italic italic underline decoration-secondary-100 underline-offset-8">
              Hiện {(model.page - 1) * model.pageSize + 1}-{Math.min(model.page * model.pageSize, model.totalCount)} trong {model.totalCount}
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

        <div className="xl:col-span-4 sticky top-24 self-start">
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
