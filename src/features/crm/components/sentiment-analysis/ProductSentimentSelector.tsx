import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { mockProducts } from '@/mocks/data/products'

interface ProductSentimentSelectorProps {
  selectedProductId: string
  onSelect: (productId: string) => void
}

export function ProductSentimentSelector({
  selectedProductId,
  onSelect,
}: ProductSentimentSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedProduct = mockProducts.find((p) => p.id === selectedProductId) || mockProducts[0]

  const filteredProducts = mockProducts
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 10)

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        Sản phẩm đang phân tích
      </label>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          className="flex w-full justify-between border border-slate-200 bg-white px-4 py-3 text-left font-semibold shadow-sm hover:bg-slate-50 md:w-[320px] rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
        >
          <div className="flex flex-col truncate">
            <span className="truncate text-sm text-slate-900">{selectedProduct.name}</span>
            <span className="text-[10px] text-slate-500">SKU: {selectedProduct.variants[0]?.internalSku}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 mt-1" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[320px] p-0" align="start">
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Tìm sản phẩm..."
              className="h-8 border-none bg-transparent p-0 focus-visible:ring-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onSelect(product.id)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 outline-none transition-colors hover:bg-slate-100",
                  selectedProductId === product.id ? "bg-indigo-50/50" : "bg-transparent"
                )}
              >
                <div className="flex flex-col text-left">
                  <span className="text-xs font-medium text-slate-900">{product.name}</span>
                  <span className="text-[10px] text-slate-500">
                    SKU: {product.variants[0]?.internalSku}
                  </span>
                </div>
                <Check
                  className={cn(
                    'h-4 w-4 text-indigo-600',
                    selectedProductId === product.id ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </button>
            ))}
            {filteredProducts.length === 0 && (
              <div className="px-3 py-4 text-center text-xs text-slate-500">
                Không tìm thấy sản phẩm nào.
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
