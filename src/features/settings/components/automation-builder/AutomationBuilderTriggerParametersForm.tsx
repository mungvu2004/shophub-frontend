import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

import type {
  AutomationBuilderTriggerParameterValue,
  AutomationBuilderTriggerParameterViewModel,
} from '@/features/settings/logic/settingsAutomationBuilder.types'

type AutomationBuilderTriggerParametersFormProps = {
  parameters: AutomationBuilderTriggerParameterViewModel[]
  onParameterChange: (parameterId: string, value: AutomationBuilderTriggerParameterValue) => void
}

export function AutomationBuilderTriggerParametersForm({
  parameters,
  onParameterChange,
}: AutomationBuilderTriggerParametersFormProps) {
  if (parameters.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
        Trigger này hiện chưa có tham số cần cấu hình.
      </div>
    )
  }

  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white px-4 py-4">
      <header>
        <h3 className="text-sm font-semibold text-slate-900">Tham số trigger</h3>
        <p className="mt-1 text-xs text-slate-500">Bạn có thể tinh chỉnh chi tiết trước khi sang bước điều kiện.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {parameters.map((parameter) => {
          const value = parameter.value

          return (
            <label key={parameter.id} className="space-y-1.5">
              <span className="text-xs font-semibold tracking-[0.02em] text-slate-700">{parameter.label}</span>
              {parameter.description ? <span className="block text-[11px] text-slate-500">{parameter.description}</span> : null}

              {parameter.type === 'text' ? (
                <Input
                  value={typeof value === 'string' ? value : String(value)}
                  placeholder={parameter.placeholder}
                  onChange={(event) => onParameterChange(parameter.id, event.target.value)}
                />
              ) : null}

              {parameter.type === 'number' ? (
                <div className="relative">
                  <Input
                    type="number"
                    value={typeof value === 'number' ? value : Number(value) || 0}
                    min={parameter.min}
                    max={parameter.max}
                    onChange={(event) => {
                      const nextValue = event.target.value === '' ? 0 : Number(event.target.value)
                      onParameterChange(parameter.id, Number.isFinite(nextValue) ? nextValue : 0)
                    }}
                    className={parameter.unitLabel ? 'pr-16' : undefined}
                  />
                  {parameter.unitLabel ? (
                    <span className="pointer-events-none absolute inset-y-0 right-3 inline-flex items-center text-xs font-medium text-slate-500">
                      {parameter.unitLabel}
                    </span>
                  ) : null}
                </div>
              ) : null}

              {parameter.type === 'select' ? (
                <select
                  value={typeof value === 'string' ? value : String(value)}
                  onChange={(event) => onParameterChange(parameter.id, event.target.value)}
                  className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-400"
                >
                  {parameter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : null}

              {parameter.type === 'switch' ? (
                <button
                  type="button"
                  onClick={() => onParameterChange(parameter.id, !value)}
                  className={cn(
                    'inline-flex h-8 w-[92px] items-center justify-center rounded-lg border text-xs font-semibold transition-colors',
                    value
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-slate-300 bg-slate-50 text-slate-600',
                  )}
                >
                  {value ? 'Đang bật' : 'Đang tắt'}
                </button>
              ) : null}
            </label>
          )
        })}
      </div>
    </section>
  )
}
