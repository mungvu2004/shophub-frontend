import { buildProductsListViewModel, ProductsListView } from '../../features/products'

export function ProductsListPage() {
  const model = buildProductsListViewModel()

  return <ProductsListView model={model} />
}


