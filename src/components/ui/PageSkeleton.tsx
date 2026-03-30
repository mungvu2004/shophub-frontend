import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

export function PageSkeleton() {
  return (
    <main className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="space-y-3">
          <Skeleton className="h-8 w-56 rounded-lg" />
          <Skeleton className="h-4 w-80 max-w-full rounded-md" />
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </section>

        <section className="rounded-xl border bg-card p-5">
          <LoadingSkeleton rows={5} />
        </section>

        <section className="rounded-xl border bg-card p-5">
          <LoadingSkeleton rows={8} />
        </section>
      </div>
    </main>
  )
}
