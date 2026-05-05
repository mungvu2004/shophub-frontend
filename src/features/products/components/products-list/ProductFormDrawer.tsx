import { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadCloud, AlertCircle, Edit, Plus, X, Package, ShieldCheck, Globe, Zap, Percent, Wallet2 } from 'lucide-react'
import type { Product } from '@/types/product.types'
import type { ActionType } from '@/features/shared/hooks/useCRUDActions'
import { cn } from '@/lib/utils'
import { PLATFORM_CONFIG } from '../../constants/platformConfig'

interface ProductFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave?: (productData: any) => Promise<void> | void
  product?: Product | null
  isProcessing?: boolean
  actionType?: ActionType
}

export function ProductFormDrawer({
  open,
  onOpenChange,
  onSave,
  product,
  isProcessing = false,
  actionType = null
}: ProductFormDrawerProps) {
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

  const [prevOpen, setPrevOpen] = useState(open)
  const [prevProduct, setPrevProduct] = useState(product)

  if (open !== prevOpen || product !== prevProduct) {
    setPrevOpen(open)
    setPrevProduct(product)
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
  }

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

  const handleClose = useCallback((isOpen: boolean) => {
    onOpenChange(isOpen)
  }, [onOpenChange])

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

  const togglePlatform = (id: string) => {
    setSyncedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent variant="drawer-right" className="p-0 gap-0 overflow-hidden flex flex-col h-full bg-slate-50/50 backdrop-blur-xl">
        {/* Modern Glass Header */}
        <DialogHeader className="p-8 pb-6 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex-shrink-0 relative">
          <div className="flex items-center gap-3 mb-2">
             <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                {isEditing ? <Edit className="size-5" /> : <Package className="size-5" />}
             </div>
             <div>
               <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                 {isEditing ? 'Chi tiết Sản phẩm' : 'Sản phẩm Mới'}
               </DialogTitle>
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                 {isEditing ? `ID: ${product.id}` : 'Khởi tạo thực thể mới'}
               </p>
             </div>
          </div>
          <DialogClose render={
            <button className="absolute right-6 top-8 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all">
              <X className="size-5" />
            </button>
          } />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-10 pb-20">
            
            {/* SECTION: Identity */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                 <ShieldCheck className="size-4 text-primary" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Định danh sản phẩm</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Hình ảnh đại diện</label>
                  <div className={cn(
                    "group relative flex h-56 cursor-pointer flex-col items-center justify-center rounded-[32px] border-2 border-dashed transition-all duration-500",
                    errors.image ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-white hover:border-primary/50 hover:bg-slate-50 shadow-sm hover:shadow-xl'
                  )}>
                    <input type="file" className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" accept="image/*" onChange={handleImageChange} />
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="h-full w-full rounded-[28px] object-cover p-2 transition-transform duration-700 group-hover:scale-[1.02]" />
                    ) : (
                      <div className={cn("flex flex-col items-center", errors.image ? 'text-red-400' : 'text-slate-300')}>
                        <div className="mb-4 rounded-3xl bg-slate-50 p-5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <UploadCloud className="size-10" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-tighter">Kéo thả hoặc Nhấn để tải</span>
                        <span className="mt-1 text-[10px] font-bold opacity-60">Định dạng JPG, PNG (Tối đa 2MB)</span>
                      </div>
                    )}
                  </div>
                  {errors.image && <p className="text-[10px] font-bold text-red-500 flex items-center gap-1.5 ml-1 mt-2 animate-pulse"><AlertCircle className="size-3.5"/>{errors.image}</p>}
                </div>

                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tên hiển thị thương mại <span className="text-red-500">*</span></label>
                  <Input 
                    placeholder="VD: Áo Hoodie Oversize Collection 2024..." 
                    className={cn(
                      "bg-white h-14 rounded-2xl text-base font-bold shadow-sm border-slate-200 focus:ring-4 focus:ring-primary/10 transition-all",
                      errors.name && 'border-red-400 focus:ring-red-100'
                    )}
                    value={name}
                    onChange={(e) => { setName(e.target.value); if (e.target.value) setErrors((prev) => ({ ...prev, name: '' })) }}
                  />
                  {errors.name && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Thương hiệu / Phân loại</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                      <Input 
                        placeholder="VD: Nike, Zara..." 
                        className="bg-white h-12 pl-11 rounded-2xl text-sm font-bold shadow-sm border-slate-200"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Trạng thái kho</label>
                    <div className="relative">
                       <Zap className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                       <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full h-12 appearance-none rounded-2xl border border-slate-200 bg-white pl-11 pr-10 text-sm font-bold text-slate-900 outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                      >
                        <option value="Active">🟢 Đang kinh doanh</option>
                        <option value="Inactive">🟡 Tạm dừng</option>
                        <option value="Deleted">🔴 Ngừng bán</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION: Economics */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                 <Wallet2 className="size-4 text-primary" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Kinh tế & Vận hành</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6 bg-primary/5 rounded-[32px] p-6 border border-primary/10">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Mã SKU Nội bộ</label>
                  <Input 
                    placeholder="SKU-XXXX" 
                    className="bg-white h-12 rounded-2xl text-sm font-mono font-black border-none shadow-sm placeholder:text-slate-300"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Giá bán đề xuất <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      placeholder="0" 
                      className={cn(
                        "bg-white h-12 pr-10 rounded-2xl text-lg font-mono font-black border-none shadow-sm",
                        errors.price && 'ring-2 ring-red-400'
                      )}
                      value={price}
                      onChange={(e) => { setPrice(e.target.value); if (Number(e.target.value) > 0) setErrors((prev) => ({ ...prev, price: '' })) }}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300">₫</span>
                  </div>
                </div>
                
                <div className="col-span-2 flex items-center justify-between px-2 pt-2 border-t border-primary/10">
                   <div className="flex items-center gap-2">
                      <Percent className="size-3.5 text-emerald-500" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Biên lợi nhuận dự kiến:</span>
                   </div>
                   <span className="text-sm font-mono font-black text-emerald-600">+35.2%</span>
                </div>
              </div>
            </div>

            {/* SECTION: Omnichannel */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                   <Globe className="size-4 text-primary" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hiện diện Đa kênh</h3>
                </div>
                <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase">{syncedPlatforms.length} Sàn</span>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(PLATFORM_CONFIG).map(([id, config]) => {
                  const isSynced = syncedPlatforms.includes(id)
                  
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => togglePlatform(id)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-3xl border-2 transition-all duration-300 group/plat",
                        isSynced 
                          ? "border-primary/20 bg-primary/5 shadow-sm" 
                          : "border-slate-100 bg-white hover:border-slate-200"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "size-12 rounded-[20px] flex items-center justify-center shadow-lg transition-transform duration-500 group-hover/plat:rotate-[360deg]",
                          config.color
                        )}>
                           <span className="text-white font-black text-base">{config.label[0]}</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-black text-slate-900 leading-none mb-1.5">{config.label}</p>
                          <div className="flex items-center gap-1.5">
                             <div className={cn("size-1.5 rounded-full animate-pulse", isSynced ? "bg-emerald-500" : "bg-slate-300")} />
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                               {isSynced ? "Kết nối hoạt động" : "Chưa kích hoạt"}
                             </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className={cn(
                        "size-6 rounded-full border-2 flex items-center justify-center transition-all",
                        isSynced ? "bg-primary border-primary text-white scale-110" : "border-slate-200 text-transparent"
                      )}>
                        <Plus className="size-3.5 stroke-[4px]" />
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

          </form>
        </div>

        {/* Modern Action Footer */}
        <DialogFooter className="p-8 pt-6 bg-white/80 backdrop-blur-md border-t border-slate-200/60 flex-shrink-0 grid grid-cols-2 gap-4">
          <DialogClose render={
            <Button
              variant="ghost"
              className="w-full h-14 rounded-3xl font-black uppercase text-xs tracking-widest text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all"
              disabled={isProcessing}
            >
              Hủy bỏ
            </Button>
          } />
          <Button
            type="submit"
            form="product-form"
            disabled={isProcessing}
            isLoading={isProcessing && (actionType === 'creating' || actionType === 'updating')}
            loadingText={isEditing ? 'Đang cập nhật...' : 'Đang tạo...'}
            className="w-full h-14 rounded-3xl font-black uppercase text-xs tracking-widest bg-slate-900 text-white shadow-2xl shadow-slate-900/20 hover:bg-primary hover:shadow-primary/40 active:scale-95 transition-all"
          >
            {isEditing ? 'Cập nhật ngay' : 'Khởi tạo ngay'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
