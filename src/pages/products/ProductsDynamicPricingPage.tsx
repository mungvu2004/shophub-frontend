import { ProductsDynamicPricingView } from '../../features/products/components/ProductsDynamicPricingView'
import { useProductsDynamicPricingPageLogic } from '../../features/products/logic/productsDynamicPricing.logic'

export function ProductsDynamicPricingPage() {
  const model = useProductsDynamicPricingPageLogic()

  return <ProductsDynamicPricingView model={model} />
}


