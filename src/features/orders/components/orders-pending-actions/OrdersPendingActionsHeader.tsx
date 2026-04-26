type OrdersPendingActionsHeaderProps = {
  title: string
  description: string
  isRefreshing: boolean
}

export function OrdersPendingActionsHeader({ title, description, isRefreshing }: OrdersPendingActionsHeaderProps) {
  return (
    <header className="space-y-2 rounded-xl border border-indigo-100 bg-gradient-to-r from-white to-indigo-50/45 bg-abstract-geometric px-4 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
        {isRefreshing ? <span className="text-xs font-semibold text-indigo-600">Đang làm mới...</span> : null}
      </div>
      <p className="text-sm text-slate-600">{description}</p>
    </header>
  )
}
