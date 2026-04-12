import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { ProfileFormDraft, SettingsProfileViewModel } from '@/features/settings/logic/settingsProfile.types'

type ProfileFormSectionProps = {
  form: SettingsProfileViewModel['form']
  onChange: <K extends keyof ProfileFormDraft>(field: K, value: ProfileFormDraft[K]) => void
}

export function ProfileFormSection({ form, onChange }: ProfileFormSectionProps) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Thông tin hồ sơ</CardTitle>
        <CardDescription>Thông tin này hiển thị trong dashboard và hoạt động cộng tác nội bộ.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[1px] text-slate-500">{form.fullNameLabel}</span>
            <Input value={form.values.fullName} onChange={(event) => onChange('fullName', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[1px] text-slate-500">{form.phoneLabel}</span>
            <Input value={form.values.phone} onChange={(event) => onChange('phone', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[1px] text-slate-500">{form.jobTitleLabel}</span>
            <Input value={form.values.jobTitle} onChange={(event) => onChange('jobTitle', event.target.value)} />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-[1px] text-slate-500">{form.timezoneLabel}</span>
            <Input value={form.values.timezone} onChange={(event) => onChange('timezone', event.target.value)} />
          </label>
        </div>

        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[1px] text-slate-500">{form.emailLabel}</span>
          <Input value={form.emailValue} disabled />
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-[1px] text-slate-500">{form.bioLabel}</span>
          <Input value={form.values.bio} onChange={(event) => onChange('bio', event.target.value)} />
        </label>
      </CardContent>
    </Card>
  )
}
