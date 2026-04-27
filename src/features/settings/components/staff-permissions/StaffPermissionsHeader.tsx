import { Plus, Shield } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'

type StaffPermissionsHeaderProps = {
  title: string
  subtitle: string
  actionLabel: string
  onActionClick: () => void
}

export function StaffPermissionsHeader({ title, subtitle, actionLabel, onActionClick }: StaffPermissionsHeaderProps) {
  return (
    <ThemedPageHeader
      title={title}
      subtitle={subtitle}
      theme="settings"
      badge={{ text: 'Permissions', icon: <Shield className="size-3.5" /> }}
    >
      <Button
        type="button"
        size="lg"
        onClick={onActionClick}
        className="min-w-[210px] bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white shadow-[0px_12px_20px_rgba(79,70,229,0.22)] hover:from-indigo-600 hover:via-indigo-600 hover:to-violet-500"
      >
        <Plus className="size-4" />
        <span>{actionLabel}</span>
      </Button>
    </ThemedPageHeader>
  )
}
