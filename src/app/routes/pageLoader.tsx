import { Suspense, type PropsWithChildren } from 'react'

import { PageSkeleton } from '@/components/PageSkeleton'

export function PageLoader({ children }: PropsWithChildren) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
}
