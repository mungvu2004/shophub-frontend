import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'

import type { AutomationRuleViewModel } from '@/features/settings/logic/settingsAutomation.types'

type AutomationRulesTableProps = {
  rules: AutomationRuleViewModel[]
  selectedRuleId: string | null
  onRuleSelect: (ruleId: string) => void
  onRuleStatusToggle: (ruleId: string, nextStatus: 'on' | 'off') => void
  onRuleActionClick: (ruleId: string, ruleTitle: string, actionId: string, actionLabel: string) => void
  togglingRuleId: string | null
  loadMoreLabel: string
}

function RuleStatusToggle({
  status,
  disabled,
  onToggle,
}: {
  status: AutomationRuleViewModel['status']
  disabled: boolean
  onToggle: () => void
}) {
  const isOn = status === 'on'

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation()
        onToggle()
      }}
      className="inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label={isOn ? 'Tắt quy tắc' : 'Bật quy tắc'}
    >
      <span className={cn('relative h-5 w-10 rounded-full transition-colors', isOn ? 'bg-emerald-200' : 'bg-slate-200')}>
        <span
          className={cn(
            'absolute top-0.5 block size-4 rounded-full shadow-sm transition-all',
            isOn ? 'right-0.5 bg-emerald-600' : 'left-0.5 bg-slate-400',
          )}
        />
      </span>
      <span className={cn('text-[11px] font-bold uppercase', isOn ? 'text-emerald-600' : 'text-slate-400')}>{isOn ? 'ON' : 'OFF'}</span>
    </button>
  )
}

export function AutomationRulesTable({
  rules,
  selectedRuleId,
  onRuleSelect,
  onRuleStatusToggle,
  onRuleActionClick,
  togglingRuleId,
  loadMoreLabel,
}: AutomationRulesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-indigo-100 bg-white">
      <div className="grid grid-cols-[56px_1.7fr_0.8fr_0.8fr_1fr] items-center border-b border-[#e7eeff] bg-gradient-to-r from-[#f0f3ff] to-[#f8faff] px-2 text-[11px] font-bold tracking-[1px] text-slate-500 uppercase">
        <div className="py-5">
          <span className="mx-auto block size-4 rounded border border-slate-300 bg-white" />
        </div>
        <div className="py-5">Quy tắc</div>
        <div className="py-5">Trạng thái</div>
        <div className="py-5">Hôm nay</div>
        <div className="py-5 text-right">Hành động</div>
      </div>

      <div className="bg-white">
        {rules.map((rule) => {
          const isSelected = selectedRuleId === rule.id

          return (
            <div
              key={rule.id}
              role="button"
              tabIndex={0}
              onClick={() => onRuleSelect(rule.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onRuleSelect(rule.id)
                }
              }}
              className={cn(
                'grid w-full grid-cols-[56px_1.7fr_0.8fr_0.8fr_1fr] items-center border-b border-slate-100 px-2 text-left transition-colors hover:bg-slate-50/80',
                isSelected && 'bg-indigo-50/45',
              )}
            >
              <div className="py-5">
                <span className={cn('mx-auto block size-4 rounded border', isSelected ? 'border-indigo-400 bg-indigo-100' : 'border-slate-300 bg-white')} />
              </div>

              <div className="py-4 pr-3">
                <p className="text-sm font-bold text-slate-900">{rule.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{rule.description}</p>
                {rule.tags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {rule.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="py-4">
                <RuleStatusToggle
                  status={rule.status}
                  disabled={togglingRuleId === rule.id}
                  onToggle={() => onRuleStatusToggle(rule.id, rule.status === 'on' ? 'off' : 'on')}
                />
              </div>

              <div className="py-4">
                <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600">
                  {rule.runsTodayLabel}
                </span>
              </div>

              <div className="flex justify-end gap-1 py-4">
                {rule.actions.map((action) => (
                  <Button
                    key={action.id}
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={(event) => {
                      event.stopPropagation()
                      onRuleActionClick(rule.id, rule.title, action.id, action.label)
                    }}
                    className={cn(
                      'h-7 rounded-md px-2 text-[12px] font-semibold',
                      action.tone === 'primary' ? 'text-indigo-600 hover:text-indigo-700' : 'text-slate-500 hover:text-slate-700',
                    )}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center border-t border-slate-100 bg-slate-50/60 px-4 py-5">
        <Button
          type="button"
          variant="link"
          onClick={() => toast.info('Danh sách hiện đã hiển thị hết dữ liệu mẫu.')} 
          className="text-sm font-semibold text-indigo-600"
        >
          {loadMoreLabel} →
        </Button>
      </div>
    </div>
  )
}
