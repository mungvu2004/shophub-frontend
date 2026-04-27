import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type PageHeaderTheme = 'dashboard' | 'inventory' | 'crm' | 'orders' | 'revenue' | 'ai' | 'products' | 'settings' | 'integrations' | 'default'

type ThemedPageHeaderProps = {
  title: string
  subtitle: string | ReactNode
  theme?: PageHeaderTheme
  badge?: {
    text: string
    icon?: ReactNode
  }
  children?: ReactNode // Right-side actions (buttons, date pickers, etc.)
  className?: string
}

const themeConfigs: Record<PageHeaderTheme, { bgClass: string; geometricElements: ReactNode; badgeClass: string }> = {
  dashboard: {
    bgClass: 'bg-[linear-gradient(135deg,#f0fdf4_0%,#dbeafe_50%,#eff6ff_100%)]', // Soft green to blue
    badgeClass: 'border-blue-200 bg-white/80 text-blue-700',
    geometricElements: (
      <>
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-blue-200/40 mix-blend-multiply" />
        <div className="pointer-events-none absolute bottom-[-30px] right-[25%] h-36 w-36 rounded-full border-[2px] border-blue-300/50" />
        <div className="pointer-events-none absolute right-[45%] top-8 h-16 w-16 rotate-45 rounded-xl bg-blue-200/30 mix-blend-multiply" />
      </>
    ),
  },
  inventory: {
    bgClass: 'bg-[linear-gradient(135deg,#ecfdf5_0%,#d1fae5_50%,#f0fdf4_100%)]', // Emerald/Teal
    badgeClass: 'border-emerald-200 bg-white/80 text-emerald-700',
    geometricElements: (
      <>
        <div className="pointer-events-none absolute -right-4 -top-8 h-48 w-48 rotate-12 rounded-[2rem] bg-emerald-200/40 mix-blend-multiply" />
        <div className="pointer-events-none absolute bottom-[-40px] right-[30%] h-40 w-40 -rotate-6 rounded-[3rem] border-[3px] border-dashed border-emerald-300/50" />
        <div className="pointer-events-none absolute left-[35%] top-12 h-20 w-20 rotate-45 rounded-2xl bg-emerald-200/30 mix-blend-multiply" />
        <div className="pointer-events-none absolute bottom-6 right-[55%] h-14 w-14 rounded-lg border border-emerald-300/60 bg-emerald-100/40" />
      </>
    ),
  },
  crm: {
    bgClass: 'bg-[linear-gradient(135deg,#faf5ff_0%,#f3e8ff_50%,#fdf4ff_100%)]', // Purple/Fuchsia
    badgeClass: 'border-purple-200 bg-white/80 text-purple-700',
    geometricElements: (
      <>
        <div className="pointer-events-none absolute -left-10 bottom-[-20px] h-56 w-72 rounded-full bg-purple-200/30 blur-2xl mix-blend-multiply" />
        <div className="pointer-events-none absolute -right-5 -top-5 h-60 w-60 rounded-full bg-purple-200/40 mix-blend-multiply" />
        <div className="pointer-events-none absolute bottom-[-30px] right-[35%] h-40 w-64 rounded-[100px] border-2 border-purple-300/40" />
      </>
    ),
  },
  orders: {
    bgClass: 'bg-[linear-gradient(135deg,#fffbeb_0%,#fef3c7_50%,#fff7ed_100%)]', // Amber/Orange
    badgeClass: 'border-amber-200 bg-white/80 text-amber-700',
    geometricElements: (
      <>
        <div className="pointer-events-none absolute -right-8 -top-8 h-56 w-56 rounded-full bg-amber-200/40 mix-blend-multiply" />
        <div className="pointer-events-none absolute bottom-12 right-[25%] h-24 w-24 rotate-45 rounded-2xl border-2 border-amber-300/50" />
        <div className="pointer-events-none absolute bottom-[-40px] right-[45%] h-36 w-36 rounded-full border-[3px] border-dotted border-amber-400/40" />
      </>
    ),
  },
  revenue: {
    bgClass: 'bg-[linear-gradient(135deg,#f8fbff_0%,#f2f7ff_55%,#eaf2ff_100%)]', // Indigo
    badgeClass: 'border-indigo-200 bg-white/80 text-indigo-700',
    geometricElements: (
      <>
        <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-indigo-200/40 mix-blend-multiply" />
        <div className="pointer-events-none absolute bottom-[-42px] right-[25%] h-32 w-32 rounded-full border-2 border-indigo-300/50" />
        <div className="pointer-events-none absolute left-[40%] top-6 h-16 w-16 rounded-full bg-indigo-200/30 mix-blend-multiply" />
      </>
    ),
  },
  ai: {
    bgClass: 'bg-[linear-gradient(135deg,#fdf4ff_0%,#f5d0fe_50%,#e879f9_100%)]', // Fuchsia/Pink magical
    badgeClass: 'border-fuchsia-200 bg-white/80 text-fuchsia-800',
    geometricElements: (
      <>
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-fuchsia-300/30 blur-3xl mix-blend-multiply" />
        <div className="pointer-events-none absolute bottom-[-20px] right-[20%] h-40 w-40 rounded-[2rem] rotate-12 border-4 border-fuchsia-300/40" />
        <div className="pointer-events-none absolute left-[35%] top-10 h-12 w-12 rotate-45 bg-fuchsia-200/50 mix-blend-multiply" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }} />
        <div className="pointer-events-none absolute bottom-10 right-[50%] h-8 w-8 rotate-12 bg-fuchsia-100/60" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      </>
    ),
  },
  products: {
    bgClass: 'bg-[linear-gradient(135deg,#f0f9ff_0%,#bae6fd_50%,#e0f2fe_100%)]', // Sky blue
    badgeClass: 'border-sky-200 bg-white/80 text-sky-800',
    geometricElements: (
      <>
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-[3rem] bg-sky-200/40 mix-blend-multiply rotate-12" />
        <div className="pointer-events-none absolute bottom-[-30px] right-[28%] h-36 w-48 rounded-[2rem] border-[3px] border-sky-300/40 -rotate-6" />
        <div className="pointer-events-none absolute left-[40%] top-8 h-20 w-20 rounded-full border-[4px] border-dashed border-sky-300/50" />
      </>
    ),
  },
  settings: {
    bgClass: 'bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_50%,#f1f5f9_100%)]', // Slate/Zinc
    badgeClass: 'border-slate-300 bg-white/80 text-slate-800',
    geometricElements: (
      <>
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-[12px] border-dashed border-slate-300/30" />
        <div className="pointer-events-none absolute bottom-[-40px] right-[30%] h-40 w-40 rounded-full bg-slate-200/50 mix-blend-multiply" />
        <div className="pointer-events-none absolute left-[45%] top-12 h-16 w-16 rotate-45 rounded-md border-2 border-slate-400/30" />
      </>
    ),
  },
  integrations: {
    bgClass: 'bg-[linear-gradient(135deg,#fff1f2_0%,#fecdd3_50%,#ffe4e6_100%)]', // Rose/Red
    badgeClass: 'border-rose-200 bg-white/80 text-rose-800',
    geometricElements: (
      <>
        <div className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-rose-200/50 mix-blend-multiply" />
        <div className="pointer-events-none absolute bottom-[-20px] right-[35%] h-32 w-32 rounded-xl rotate-12 border-2 border-rose-300/50" />
        <div className="pointer-events-none absolute right-[20%] top-20 h-px w-40 bg-rose-300/60 -rotate-45" />
        <div className="pointer-events-none absolute left-[40%] top-10 h-10 w-10 rounded-full border-[3px] border-rose-300/60" />
      </>
    ),
  },
  default: {
    bgClass: 'bg-[linear-gradient(135deg,#f8fafc_0%,#f1f5f9_100%)]', // Slate
    badgeClass: 'border-slate-200 bg-white/80 text-slate-700',
    geometricElements: (
      <>
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-slate-200/40 mix-blend-multiply" />
        <div className="pointer-events-none absolute bottom-[-20px] right-[30%] h-24 w-24 rounded-full border-2 border-slate-300/40" />
      </>
    ),
  },
}

export function ThemedPageHeader({
  title,
  subtitle,
  theme = 'default',
  badge,
  children,
  className,
}: ThemedPageHeaderProps) {
  const config = themeConfigs[theme]

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-[28px] border border-slate-200/80 p-6 shadow-[0_30px_65px_-48px_rgba(15,23,42,0.45)]',
        config.bgClass,
        className
      )}
    >
      {/* Background Geometric Elements */}
      {config.geometricElements}

      <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        {/* Left Side: Text and Badge */}
        <div className="flex-1">
          {badge && (
            <span
              className={cn(
                'mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.45px]',
                config.badgeClass
              )}
            >
              {badge.icon}
              {badge.text}
            </span>
          )}
          <h1 className="max-w-2xl text-[32px] font-black leading-[1.1] tracking-[-0.6px] text-slate-900">
            {title}
          </h1>
          <div className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{subtitle}</div>
        </div>

        {/* Right Side: Actions */}
        {children && <div className="flex w-full flex-col gap-3 sm:flex-row sm:w-auto sm:items-center">{children}</div>}
      </div>
    </article>
  )
}
