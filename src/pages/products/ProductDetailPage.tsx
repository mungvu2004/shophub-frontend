import { ProductDetailView, useProductDetailViewModel } from '@/features/products'

export function ProductDetailPage() {
  const model = useProductDetailViewModel()

  return <ProductDetailView model={model} />
}
