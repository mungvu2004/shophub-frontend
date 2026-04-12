import { cn } from '@/lib/utils'

type InvitePermissionToggleProps = {
  label: string
  checked: boolean
  onToggle: () => void
}

export function InvitePermissionToggle({ label, checked, onToggle }: InvitePermissionToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className="flex w-full items-center justify-between rounded-[8px] bg-[#f8fafc] px-3 py-3 text-left transition-colors hover:bg-slate-100"
    >
      <span className="text-[14px] font-medium text-slate-900">{label}</span>
      <span
        className={cn(
          'flex size-4 items-center justify-center rounded-[4px] border transition-colors',
          checked ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-500 bg-white',
        )}
      >
        {checked ? <span className="text-[10px] leading-none">✓</span> : null}
      </span>
    </button>
  )
}