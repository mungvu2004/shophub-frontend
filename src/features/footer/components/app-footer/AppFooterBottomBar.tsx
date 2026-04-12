type AppFooterBottomBarProps = {
  updatedLabel: string
  copyrightLabel: string
}

export function AppFooterBottomBar({ updatedLabel, copyrightLabel }: AppFooterBottomBarProps) {
  return (
    <section className="flex flex-col gap-1 border-t border-slate-200 pt-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
      <p>{copyrightLabel}</p>
      <p>{updatedLabel}</p>
    </section>
  )
}