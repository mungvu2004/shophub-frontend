import { useProductsListViewModel, ProductsListView } from '../../features/products'

export function ProductsListPage() {
  const model = useProductsListViewModel()

  return <ProductsListView model={model} />
}


