import { ProductDetailView, buildProductDetailViewModel } from '@/features/products'

export function ProductDetailPage() {
  const model = buildProductDetailViewModel()

  return <ProductDetailView model={model} />
}
