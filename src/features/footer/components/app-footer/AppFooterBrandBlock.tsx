import { PhoneCall } from 'lucide-react'

type AppFooterBrandBlockProps = {
  brandName: string
  headline: string
  description: string
  supportEmail: string
  supportPhone: string
}

export function AppFooterBrandBlock({
  brandName,
  headline,
  description,
  supportEmail,
  supportPhone,
}: AppFooterBrandBlockProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
        {brandName}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold leading-6 text-slate-900">{headline}</h3>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <a
          href={`mailto:${supportEmail}`}
          className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 transition-colors hover:border-orange-300 hover:text-orange-700"
        >
          {supportEmail}
        </a>
        <span className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-slate-700">
          <PhoneCall className="size-4" />
          {supportPhone}
        </span>
      </div>
    </section>
  )
}