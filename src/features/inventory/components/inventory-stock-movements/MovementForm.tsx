import { Input } from '@/components/ui/input'
import type { StockLevel, Warehouse, MovementType } from '@/types/inventory.types'
import type { CreateMovementFormState } from '@/features/inventory/hooks/useCreateMovement'

type MovementFormProps = {
  form: CreateMovementFormState
  inventoryItems: StockLevel[]
  warehouses: Warehouse[]
  type: 'IMPORT' | 'EXPORT'
  onFieldChange: <K extends keyof CreateMovementFormState>(key: K, value: CreateMovementFormState[K]) => void
}

const importReasons = ['Nhập hàng bổ sung', 'Hoàn hàng từ khách', 'Kiểm kê định kỳ', 'Khác']
const exportReasons = ['Xuất hàng đi đơn', 'Xuất hàng hỏng/hết hạn', 'Xuất hàng mẫu', 'Kiểm kê định kỳ', 'Khác']



export function MovementForm({ form, inventoryItems, warehouses, type, onFieldChange }: MovementFormProps) {
  const reasons = type === 'IMPORT' ? importReasons : exportReasons
  
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label htmlFor="form-variant-id" className="text-sm font-medium text-slate-700">Sản phẩm / SKU</label>
        <select
          id="form-variant-id"
          value={form.variantId}
          onChange={(e) => onFieldChange('variantId', e.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">Chọn SKU</option>
          {inventoryItems.map((item) => (
            <option key={item.id} value={item.variantId}>
              {item.sku} - {item.productName || item.variantName}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="form-warehouse-id" className="text-sm font-medium text-slate-700">Kho hàng</label>
          <select
            id="form-warehouse-id"
            value={form.warehouseId}
            onChange={(e) => onFieldChange('warehouseId', e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="form-delta" className="text-sm font-medium text-slate-700">Số lượng</label>
          <Input
            id="form-delta"
            type="number"
            min="1"
            value={form.delta}
            onChange={(e) => onFieldChange('delta', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="form-reason" className="text-sm font-medium text-slate-700">Lý do</label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Lý do gợi ý">
          {reasons.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onFieldChange('reason', r)}
              aria-pressed={form.reason === r}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                form.reason === r
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <Input
          id="form-reason"
          placeholder="Lý do chi tiết..."
          value={form.reason}
          onChange={(e) => (onFieldChange('reason', e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="form-note" className="text-sm font-medium text-slate-700">Ghi chú (không bắt buộc)</label>
        <textarea
          id="form-note"
          value={form.note}
          onChange={(e) => onFieldChange('note', e.target.value)}
          placeholder="Nhập ghi chú thêm..."
          className="min-h-24 w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="space-y-3 pt-2">
        <label className="text-sm font-medium text-slate-700 block">Minh chứng / Chứng từ đính kèm</label>
        <div className="grid grid-cols-1 gap-3">
          <input 
            type="file" 
            id="form-file-upload" 
            className="hidden" 
            multiple 
            onChange={() => toast.success('Đã đính kèm chứng từ!')}
          />
          <label 
            htmlFor="form-file-upload"
            className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-primary-300 transition-all cursor-pointer group"
          >
            <div className="size-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 mb-2 group-hover:scale-110 transition-transform">
              <Upload className="size-5 text-slate-400 group-hover:text-primary-600" />
            </div>
            <p className="text-xs font-bold text-slate-500">Kéo thả hoặc bấm để tải lên</p>
            <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Hỗ trợ PDF, JPG, PNG (Max 5MB)</p>
          </label>
        </div>
      </div>
    </div>
  )
}
ext-xs font-bold text-slate-500">Kéo thả hoặc bấm để tải lên</p>
            <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Hỗ trợ PDF, JPG, PNG (Max 5MB)</p>
          </label>
        </div>
      </div>
    </div>
  )
}
