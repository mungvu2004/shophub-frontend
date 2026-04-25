import { Skeleton } from '@/components/ui/skeleton'

export function DashboardAlertsNotificationsSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-start animate-pulse">
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="h-32 w-full rounded-2xl border border-slate-100 bg-white p-5" />

        {/* Summary Strip Skeleton */}
        <div className="h-40 w-full rounded-2xl border border-slate-100 bg-white p-5 space-y-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>

        {/* Sections Skeleton */}
        <div className="space-y-8">
          {[1, 2].map((section) => (
            <div key={section} className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid gap-4">
                {[1, 2].map((card) => (
                  <div key={card} className="h-48 w-full rounded-2xl border border-slate-100 bg-white p-5 space-y-3">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-9 w-28 rounded-xl" />
                      <Skeleton className="h-9 w-28 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="space-y-6">
        <div className="h-64 w-full rounded-2xl border border-slate-100 bg-white p-6" />
        <div className="h-40 w-full rounded-2xl border border-slate-100 bg-slate-50 p-6" />
      </aside>
    </div>
  )
}
