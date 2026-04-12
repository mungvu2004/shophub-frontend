import type { ReactNode } from 'react'

type SectionTitleProps = {
  title: string
  rightSlot?: ReactNode
}

export function SectionTitle({ title, rightSlot }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[1.4px] text-muted-foreground">
        <span className="inline-block h-4 w-1 rounded-full bg-primary" />
        {title}
      </h2>
      {rightSlot}
    </div>
  )
}
