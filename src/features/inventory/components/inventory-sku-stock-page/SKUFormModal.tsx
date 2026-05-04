import { useState } from 'react'
import { CRUDModal } from '@/components/shared/CRUDModal'
import type { StockLevel } from '@/types/inventory.types'

type SKUFormModalProps = {
  isOpen: boolean
  onClose: () => void
  initialData?: StockLevel | null
  onSubmit: (data: Partial<StockLevel>) => void
  isProcessing: boolean
}

export function SKUFormModal({ isOpen, onClose, initialData, onSubmit, isProcessing }: SKUFormModalProps) {
  const [formData, setFormData] = useState<Partial<StockLevel>>({
    sku: '',
    productName: '',
    category: '',
    physicalQty: 0,
  })

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  const [prevInitialData, setPrevInitialData] = useState(initialData)

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen)
    setPrevInitialData(initialData)
    if (isOpen && initialData) {
      setFormData({
        sku: initialData.sku,
        productName: initialData.productName,
        category: initialData.category,
        physicalQty: initialData.physicalQty,
      })
    } else if (isOpen && !initialData) {
      setFormData({
        sku: '',
        productName: '',
        category: '',
        physicalQty: 0,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isEditMode = !!initialData

  return (
    <CRUDModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Chỉnh sửa SKU' : 'Thêm mới SKU'}
      onSubmit={handleSubmit}
      isProcessing={isProcessing}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Mã SKU</label>
          <input
            type="text"
            required
            disabled={isEditMode || isProcessing}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
            value={formData.sku || ''}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="VD: SP-001"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Tên sản phẩm</label>
          <input
            type="text"
            required
            disabled={isProcessing}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
            value={formData.productName || ''}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            placeholder="VD: Áo thun trắng"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Phân loại</label>
          <input
            type="text"
            required
            disabled={isProcessing}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="VD: Áo"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Tồn kho ban đầu</label>
          <input
            type="number"
            min="0"
            required
            disabled={isEditMode || isProcessing}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
            value={formData.physicalQty || 0}
            onChange={(e) => setFormData({ ...formData, physicalQty: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>
    </CRUDModal>
  )
}
