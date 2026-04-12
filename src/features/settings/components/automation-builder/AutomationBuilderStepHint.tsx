type AutomationBuilderStepHintProps = {
  title: string
  description: string
}

export function AutomationBuilderStepHint({ title, description }: AutomationBuilderStepHintProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-[0_6px_16px_rgba(15,23,42,0.04)]">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </section>
  )
}
