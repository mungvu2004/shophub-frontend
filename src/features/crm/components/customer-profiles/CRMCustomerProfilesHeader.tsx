import { Download, Loader2, Plus, Search, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemedPageHeader } from '@/components/shared/ThemedPageHeader'
import { MESSAGES } from '@/constants/messages'

type CRMCustomerProfilesHeaderProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  exportLabel: string
  onExport: () => void
  onAddCustomer: () => void
  isProcessing?: boolean
  actionType?: 'creating' | 'updating' | 'deleting' | 'status-changing' | null
}

export function CRMCustomerProfilesHeader({
  searchValue,
  onSearchChange,
  exportLabel,
  onExport,
  onAddCustomer,
  isProcessing = false,
  actionType = null,
}: CRMCustomerProfilesHeaderProps) {
  const isCreating = isProcessing && actionType === 'creating'

  return (
    <ThemedPageHeader
      title="Hồ sơ Khách hàng"
      subtitle="Quản lý &amp; phân tích khách hàng đa kênh"
      theme="crm"
      badge={{ text: 'Hồ sơ', icon: <Users className="size-3.5" /> }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full">
        <label className="relative w-full sm:w-[320px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-purple-400" />
          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm theo tên, SĐT, mã KH..."
            className="h-10 rounded-xl bg-white/80 backdrop-blur pl-9 shadow-sm border-purple-200/50 focus-visible:ring-purple-500 placeholder:text-purple-300"
          />
        </label>

        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl px-5 bg-white/80 backdrop-blur border-purple-200/50 text-purple-900 font-bold shadow-sm hover:bg-white hover:text-purple-700"
          onClick={onExport}
          disabled={isProcessing}
        >
          <Download className="size-4 mr-2" />
          {exportLabel}
        </Button>

        <Button
          type="button"
          className="h-10 rounded-xl bg-indigo-600 px-5 font-bold text-white shadow-sm hover:bg-indigo-700"
          onClick={onAddCustomer}
          disabled={isProcessing}
        >
          {isCreating ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
          {isCreating ? MESSAGES.CRM.CUSTOMER.BUTTON.ADD_LOADING : MESSAGES.CRM.CUSTOMER.BUTTON.ADD}
        </Button>
      </div>
    </ThemedPageHeader>
  )
}
