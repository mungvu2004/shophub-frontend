import { Download, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type CRMCustomerProfilesHeaderProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  exportLabel: string
  onExport: () => void
}

export function CRMCustomerProfilesHeader({
  searchValue,
  onSearchChange,
  exportLabel,
  onExport,
}: CRMCustomerProfilesHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-1">
        <h1 className="text-[22px] font-bold tracking-[-0.03em] text-slate-900">Hồ sơ Khách hàng</h1>
        <p className="text-sm text-slate-500">Quản lý &amp; phân tích khách hàng đa kênh</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative w-full sm:w-[320px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm theo tên, SĐT, mã KH..."
            className="h-10 rounded-lg bg-white pl-9 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
          />
        </label>

        <Button type="button" variant="outline" className="h-10 rounded-lg px-5" onClick={onExport}>
          <Download className="size-4" />
          {exportLabel}
        </Button>
      </div>
    </div>
  )
}
