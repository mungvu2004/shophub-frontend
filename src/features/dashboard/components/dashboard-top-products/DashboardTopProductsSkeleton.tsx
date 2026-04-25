import { Skeleton } from '@/components/ui/skeleton'

export function DashboardTopProductsSkeleton() {
  return (
    <div className="space-y-6 pb-8">
      {/* Controls Skeleton */}
      <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-40 rounded-lg" />
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
        </div>
        <div className="flex gap-8 border-b border-slate-100 pb-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
      </section>

      {/* Podium Skeleton */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${i === 1 ? 'lg:-mt-3' : ''}`}>
            <Skeleton className="absolute -top-4 left-5 h-8 w-8 rounded-full" />
            <Skeleton className="mx-auto h-24 w-24 rounded-xl" />
            <div className="mt-4 space-y-2">
              <Skeleton className="mx-auto h-5 w-3/4" />
              <Skeleton className="mx-auto h-3 w-1/2" />
              <Skeleton className="mx-auto mt-2 h-6 w-20 rounded-lg" />
            </div>
            <div className="mt-6 flex justify-center">
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="mt-8 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </section>

      {/* Table Skeleton */}
      <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-5 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
