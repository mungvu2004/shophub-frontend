import { ProductsCompetitorTrackingView } from '@/features/products/components/ProductsCompetitorTrackingView'
import { useProductsCompetitorTrackingPageLogic } from '@/features/products/logic/productsCompetitorTracking.logic'

export function ProductsCompetitorTrackingPage() {
  const model = useProductsCompetitorTrackingPageLogic()

  return <ProductsCompetitorTrackingView model={model} />
}


