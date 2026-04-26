import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadCloud, Check } from 'lucide-react'

interface ProductCreateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductCreateModal({ open, onOpenChange }: ProductCreateModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])

  const platforms = [
    { id: 'shopee', label: 'Shopee', color: 'bg-orange-500' },
    { id: 'tiktok_shop', label: 'TikTok Shop', color: 'bg-black' },
    { id: 'lazada', label: 'Lazada', color: 'bg-blue-600' },
  ]

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setPreviewImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Log submit (mock action)
    console.log('Tạo sản phẩm mới')
    onOpenChange(false)
    setPreviewImage(null)
    setSelectedPlatforms([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Thêm sản phẩm mới</DialogTitle>
        </DialogHeader>

        <form id="create-product-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Hình ảnh sản phẩm</label>
            <div className="relative flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
              <input
                type="file"
                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewImage ? (
                <img src={previewImage} alt="Preview" className="h-full w-full rounded-lg object-cover" />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <UploadCloud className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Tải ảnh lên (Max 2MB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Tên sản phẩm *</label>
              <Input placeholder="Nhập tên sản phẩm..." required className="bg-slate-50 h-11" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">SKU</label>
                <Input placeholder="VD: SP001" className="bg-slate-50 h-11" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Giá bán (₫) *</label>
                <Input type="number" placeholder="0" required className="bg-slate-50 h-11" />
              </div>
            </div>
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Sàn TMĐT đồng bộ</label>
            <div className="flex gap-3">
              {platforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id)
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => togglePlatform(platform.id)}
                    className={`relative flex-1 rounded-xl border p-3 text-center transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -right-1.5 -top-1.5 rounded-full bg-indigo-600 p-0.5 text-white">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    <span className="text-sm font-bold">{platform.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </form>

        <DialogFooter className="mt-2 border-t pt-4">
          <DialogClose render={<Button variant="outline" className="w-24">Hủy</Button>} />
          <Button type="submit" form="create-product-form" className="w-32 bg-indigo-600 hover:bg-indigo-700">
            Tạo mới
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
