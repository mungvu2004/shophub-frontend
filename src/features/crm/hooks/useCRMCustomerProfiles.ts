import { useQuery } from '@tanstack/react-query'

import { crmCustomerProfilesService } from '@/features/crm/services/crmCustomerProfilesService'
import type { CRMCustomerProfilesResponse } from '@/types/crm.types'

export function useCRMCustomerProfiles(filters: { search?: string; customerId?: string }) {
  return useQuery({
    queryKey: ['crm', 'customer-profiles', filters] as const,
    queryFn: (): Promise<CRMCustomerProfilesResponse> => crmCustomerProfilesService.getCustomerProfiles(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  })
}
