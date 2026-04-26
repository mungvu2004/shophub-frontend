import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadCloud, AlertCircle, Trash2, Edit, Plus } from 'lucide-react'
import type { Product } from '@/types/product.types'
import { cn } from '@/lib/utils'

interface ProductFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (productData: any) => void
  product?: Product | null
}

export function ProductFormDrawer({ open, onOpenChange, onSave, product, availablePlatforms = [] }: ProductFormDrawerProps & { availablePlatforms?: {id: string, label: string, color: string}[] }) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  // Form states
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [price, setPrice] = useState('')
  const [brand, setBrand] = useState('')
  const [status, setStatus] = useState('Active')
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [syncedPlatforms, setSyncedPlatforms] = useState<string[]>([])

  const isEditing = !!product

  useEffect(() => {
    if (open) {
      if (product) {
        setName(product.name)
        setSku(product.variants?.[0]?.internalSku || '')
        setPrice(product.variants?.[0]?.salePrice?.toString() || '')
        setBrand(product.brand || '')
        setStatus(product.status || 'Active')
        setPreviewImage(product.variants?.[0]?.mainImageUrl || null)
        
        const platforms = new Set<string>()
        product.variants?.forEach(v => {
           v.listings?.forEach(l => platforms.add(l.platform))
        })
        setSyncedPlatforms(Array.from(platforms))
      } else {
        setName('')
        setSku('')
        setPrice('')
        setBrand('')
        setStatus('Active')
        setPreviewImage(null)
        setSyncedPlatforms([])
      }
      setErrors({})
    }
  }, [open, product])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: 'Kích thước ảnh vượt quá 2MB' }))
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
        setErrors((prev) => ({ ...prev, image: '' }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClose = (isOpen: boolean) => {
    onOpenChange(isOpen)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = 'Vui lòng nhập tên sản phẩm'
    if (!price || Number(price) <= 0) newErrors.price = 'Giá bán phải lớn hơn 0'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (onSave) {
      onSave({ id: product?.id, name, sku, price, brand, status, syncedPlatforms })
    }
    handleClose(false)
  }

  const handleAddPlatform = (id: string) => {
    if (!syncedPlatforms.includes(id)) {
      setSyncedPlatforms([...syncedPlatforms, id])
    }
  }

  const handleRemovePlatform = (id: string) => {
    setSyncedPlatforms(syncedPlatforms.filter(p => p !== id))
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent variant="drawer-right" className="p-0 gap-0 overflow-hidden flex flex-col h-full bg-slate-50">
        <DialogHeader className="p-6 pb-4 bg-white border-b border-slate-100 flex-shrink-0 relative">
          <DialogTitle className="text-xl font-bold text-slate-900">
            {isEditing ? 'Chi tiết Sản phẩm' : 'Thêm Sản phẩm Mới'}
          </DialogTitle>
          <p className="text-sm font-medium text-slate-500 mt-1">
            {isEditing ? `Chỉnh sửa thông tin cho ${name}` : 'Điền đầy đủ thông tin để tạo mới sản phẩm'}
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* General Info Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-5">
              <h3 className="font-black text-sm uppercase tracking-wide text-slate-900">Thông tin cơ bản</h3>
              
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wide text-slate-500">Hình ảnh</label>
                <div className={cn("relative flex h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors", errors.image ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100')}>
                  <input type="file" className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" accept="image/*" onChange={handleImageChange} />
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="h-full w-full rounded-lg object-cover" />
                  ) : (
                    <div className={cn("flex flex-col items-center", errors.image ? 'text-red-400' : 'text-slate-400')}>
                      <UploadCloud className="h-8 w-8 mb-2" />
                      <span className="text-sm font-bold">Tải ảnh lên (Max 2MB)</span>
                    </div>
                  )}
                </div>
                {errors.image && <p className="text-xs font-semibold text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.image}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wide text-slate-500">Tên sản phẩm <span className="text-red-500">*</span></label>
                <Input 
                  placeholder="Nhập tên sản phẩm..." 
                  className={cn("bg-slate-50 h-11 rounded-xl text-sm font-semibold", errors.name && 'border-red-400 focus-visible:ring-red-400')}
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (e.target.value) setErrors((prev) => ({ ...prev, name: '' })) }}
                />
                {errors.name && <p className="text-xs font-semibold text-red-500">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wide text-slate-500">Danh mục / Thương hiệu</label>
                  <Input 
                    placeholder="VD: Quần tây" 
                    className="bg-slate-50 h-11 rounded-xl text-sm font-semibold"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wide text-slate-500">Trạng thái</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none"
                  >
                    <option value="Active">Đang bán</option>
                    <option value="Inactive">Tạm dừng</option>
                    <option value="Deleted">Hết hàng</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & SKU */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-5">
              <h3 className="font-black text-sm uppercase tracking-wide text-slate-900">Bán hàng & Tồn kho</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wide text-slate-500">SKU nội bộ</label>
                  <Input 
                    placeholder="VD: SP001" 
                    className="bg-slate-50 h-11 rounded-xl text-sm font-mono font-bold"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wide text-slate-500">Giá bán (₫) <span className="text-red-500">*</span></label>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    className={cn("bg-slate-50 h-11 rounded-xl text-sm font-mono font-bold", errors.price && 'border-red-400 focus-visible:ring-red-400')}
                    value={price}
                    onChange={(e) => { setPrice(e.target.value); if (Number(e.target.value) > 0) setErrors((prev) => ({ ...prev, price: '' })) }}
                  />
                  {errors.price && <p className="text-xs font-semibold text-red-500">{errors.price}</p>}
                </div>
              </div>
            </div>

            {/* Sync Platforms */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-sm uppercase tracking-wide text-slate-900">Sàn TMĐT Đồng bộ</h3>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{syncedPlatforms.length} nền tảng</span>
              </div>
              
              <div className="space-y-3">
                {availablePlatforms.map((platform) => {
                  const isSynced = syncedPlatforms.includes(platform.id)
                  
                  return (
                    <div key={platform.id} className={cn("flex items-center justify-between p-3 rounded-xl border transition-all", isSynced ? "border-indigo-200 bg-indigo-50/50" : "border-slate-100 bg-slate-50")}>
                      <div className="flex items-center gap-3">
                        <div className={cn("size-8 rounded-lg flex items-center justify-center shadow-sm", platform.color)}>
                           <span className="text-white font-black text-[10px]">{platform.label[0]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{platform.label}</p>
                          <p className="text-[11px] font-semibold text-slate-500">{isSynced ? "Đang đồng bộ" : "Chưa liên kết"}</p>
                        </div>
                      </div>
                      
                      {isSynced ? (
                        <div className="flex items-center gap-1">
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600 bg-white" title="Chỉnh sửa liên kết">
                            <Edit className="size-3.5" />
                          </Button>
                          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-rose-600 bg-white" title="Huỷ đồng bộ" onClick={() => handleRemovePlatform(platform.id)}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <Button type="button" variant="outline" size="sm" className="h-8 text-[11px] font-bold" onClick={() => handleAddPlatform(platform.id)}>
                          <Plus className="mr-1.5 size-3.5" /> Thêm
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

          </form>
        </div>

        <DialogFooter className="p-4 bg-white border-t border-slate-100 flex-shrink-0 grid grid-cols-2 gap-3">
          <DialogClose render={<Button variant="outline" className="w-full h-12 rounded-xl font-bold">Hủy</Button>} />
          <Button type="submit" form="product-form" className="w-full h-12 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700">
            {isEditing ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
