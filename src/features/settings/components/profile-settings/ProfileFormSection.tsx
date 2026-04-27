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
        <CardTitle>{form.title}</CardTitle>
        <CardDescription>{form.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-secondary-700">{form.fullNameLabel}</span>
            <Input value={form.values.fullName} onChange={(event) => onChange('fullName', event.target.value)} placeholder="Nhập họ và tên" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-secondary-700">{form.phoneLabel}</span>
            <Input value={form.values.phone} onChange={(event) => onChange('phone', event.target.value)} placeholder="Nhập số điện thoại" />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-secondary-700">{form.jobTitleLabel}</span>
            <Input value={form.values.jobTitle} onChange={(event) => onChange('jobTitle', event.target.value)} placeholder="VD: Quản lý cửa hàng" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-secondary-700">{form.timezoneLabel}</span>
            <Input value={form.values.timezone} onChange={(event) => onChange('timezone', event.target.value)} />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-secondary-700">{form.emailLabel}</span>
            <Input value={form.emailValue} disabled className="bg-secondary-50" />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-secondary-700">{form.bioLabel}</span>
          <Input value={form.values.bio} onChange={(event) => onChange('bio', event.target.value)} placeholder="Giới thiệu ngắn về bản thân..." />
        </label>
      </CardContent>
    </Card>
  )
}
