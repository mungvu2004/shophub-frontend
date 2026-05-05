import { useDeferredValue, useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'

import { CRMCustomerProfilesHeader } from '@/features/crm/components/customer-profiles/CRMCustomerProfilesHeader'
import { CRMCustomerProfileLifecycleCard } from '@/features/crm/components/customer-profiles/CRMCustomerProfileLifecycleCard'
import { CRMCustomerProfileMetricsGrid } from '@/features/crm/components/customer-profiles/CRMCustomerProfileMetricsGrid'
import { CRMCustomerProfileOrderHistoryCard } from '@/features/crm/components/customer-profiles/CRMCustomerProfileOrderHistoryCard'
import { CRMCustomerProfileOverviewCard } from '@/features/crm/components/customer-profiles/CRMCustomerProfileOverviewCard'
import { CRMCustomerProfilesSidebar } from '@/features/crm/components/customer-profiles/CRMCustomerProfilesSidebar'
import { CRMCustomerProfilesTableCard } from '@/features/crm/components/customer-profiles/CRMCustomerProfilesTableCard'
import { useCRMCustomerProfiles } from '@/features/crm/hooks/useCRMCustomerProfiles'
import { useProductData } from '@/features/products/hooks/useProductData'
import {
  buildCRMCustomerProfilesViewModel,
  type CRMCustomerProfileOrderFilter,
} from '@/features/crm/logic/crmCustomerProfiles.logic'
import { Button } from '@/components/ui/button'

export function CRMCustomerProfilesScreen() {
  // Centralized product data from store
  useProductData({
    autoPreload: false,
    pageName: 'CRMCustomerProfilesPage',
  })

  const [search, setSearch] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>()
  const [orderFilter, setOrderFilter] = useState<CRMCustomerProfileOrderFilter>('all')

  const deferredSearch = useDeferredValue(search)
  const query = useCRMCustomerProfiles({
    search: deferredSearch,
    customerId: selectedCustomerId,
  })

  if (query.data?.selectedCustomerId && query.data.selectedCustomerId !== selectedCustomerId) {
    setSelectedCustomerId(query.data.selectedCustomerId)
  }

  const model = useMemo(() => {
    if (!query.data) return null
    return buildCRMCustomerProfilesViewModel(query.data, orderFilter)
  }, [orderFilter, query.data])

  return (
    <div className="space-y-6 pb-6">
      <CRMCustomerProfilesHeader
        searchValue={search}
        onSearchChange={setSearch}
        exportLabel="Xuất danh sách"
        onExport={() => undefined}
      />

      <CRMCustomerProfilesTableCard
        customers={model?.customers ?? []}
        isLoading={query.isLoading}
        selectedCustomerId={model?.selectedCustomer?.id ?? ''}
        onSelectCustomer={setSelectedCustomerId}
        onViewDetails={() => {
          document.getElementById('crm-customer-profile-detail')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }}
      />

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-12" id="crm-customer-profile-detail">
        <div className="space-y-8 xl:col-span-8">
          <CRMCustomerProfileOverviewCard selectedCustomer={model?.selectedCustomer ?? null} />

          <CRMCustomerProfileMetricsGrid selectedCustomer={model?.selectedCustomer ?? null} />

          <CRMCustomerProfileLifecycleCard selectedCustomer={model?.selectedCustomer ?? null} />

          <CRMCustomerProfileOrderHistoryCard
            selectedCustomer={model?.selectedCustomer ?? null}
            selectedFilter={orderFilter}
            onFilterChange={setOrderFilter}
          />
        </div>

        <div className="space-y-5 xl:col-span-4">
          <CRMCustomerProfilesSidebar selectedCustomer={model?.selectedCustomer ?? null} />

          <div className="rounded-[12px] border border-slate-200 bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ArrowRight className="size-4 text-slate-500" />
              Điều hướng nhanh
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Chọn một khách hàng trong bảng trên để cập nhật toàn bộ insight, timeline và lịch sử đơn.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setOrderFilter('returns')}>
                Xem đơn hoàn/hủy
              </Button>
              <Button variant="ghost" size="sm" type="button" onClick={() => setOrderFilter('all')}>
                Reset bộ lọc
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
