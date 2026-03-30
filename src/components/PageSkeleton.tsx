export function PageSkeleton() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="h-9 w-56 animate-pulse rounded-md bg-muted" />
        <div className="h-28 animate-pulse rounded-xl bg-muted" />
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    </main>
  )
}
