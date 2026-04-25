import type { ProductTagViewModel } from '@/features/dashboard/logic/dashboardTopProducts.types'

const tagStyles: Record<ProductTagViewModel['type'], string> = {
  hero: 'bg-primary-50 text-primary-700 border-primary-100',
  rising_star: 'bg-amber-50 text-amber-700 border-amber-100',
  long_tail: 'bg-slate-50 text-slate-600 border-slate-200',
  new_entry: 'bg-emerald-50 text-emerald-700 border-emerald-100',
}

export function ProductTag({ tag }: { tag: ProductTagViewModel }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tagStyles[tag.type]}`}>
      {tag.label}
    </span>
  )
}
