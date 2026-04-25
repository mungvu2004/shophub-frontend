import { DataTable, type DataTableSortState } from '@/components/shared/DataTable'
import { Pagination } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import type { InventoryTableViewModel } from '@/features/inventory/logic/inventoryTable.types'
import { Trash2 } from 'lucide-react'
import { useMemo } from 'react'
import { getInventoryColumns } from './inventoryTableColumns'

type InventoryTableProps = {
  model: InventoryTableViewModel
}

export function InventoryTable({ model }: InventoryTableProps) {
  const columns = useMemo(() => getInventoryColumns(model), [model]);

  return (
    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {model.selectedRows.length > 0 && (
        <div className="border-b border-indigo-100 bg-indigo-50/50 px-6 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {model.selectedRows.length}
            </div>
            <span className="text-sm font-semibold text-slate-700">SKU đã chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 h-8 text-xs font-bold" 
              onClick={() => model.onBulkAdjust?.()}
            >
              Điều chỉnh hàng loạt
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white border-red-100 hover:bg-red-50 text-red-600 h-8 text-xs font-bold" 
              onClick={() => { if (confirm(`Bạn có chắc muốn xóa ${model.selectedRows.length} mục này?`)) model.onDeleteRows?.(model.selectedRows); }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="ml-1.5">Xóa</span>
            </Button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto overflow-y-hidden flex-1 scrollbar-thin scrollbar-thumb-slate-200">
        {model.isLoading && model.rows.length === 0 ? (
          <div className="p-8"><LoadingSkeleton rows={5} /></div>
        ) : (
          <DataTable
            rows={model.rows}
            columns={columns}
            sortState={model.sortState as DataTableSortState | undefined}
            onSortChange={(state) => model.onSortChange?.(state)}
            rowKey={(row) => row.id}
            tableClassName="min-w-[1200px]"
            bodyClassName="bg-white"
            rowClassName={() => `group border-b border-slate-100 transition-all duration-200 hover:bg-slate-50/50`}
            emptyText="Không có dữ liệu tồn kho."
          />
        )}
      </div>
      
      <div className="border-t border-slate-100 bg-slate-50/30 px-4 py-3">
        <Pagination
          currentPage={model.currentPage}
          totalCount={model.totalCount}
          pageSize={model.pageSize}
          onPageChange={model.onPageChange}
          onPageSizeChange={model.onPageSizeChange}
          pageSizeOptions={model.pageSizeOptions}
        />
      </div>
    </div>
  )
}
