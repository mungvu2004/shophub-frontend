import { apiClient } from '@/services/apiClient'
import type { CRMCustomerProfilesResponse } from '@/types/crm.types'

type CustomerProfilesEnvelope = {
  data?: CRMCustomerProfilesResponse | { data?: CRMCustomerProfilesResponse }
}

const toCustomerProfilesData = (payload: unknown): CRMCustomerProfilesResponse | null => {
  if (!payload || typeof payload !== 'object') return null

  const candidate = payload as CustomerProfilesEnvelope & CRMCustomerProfilesResponse

  if (candidate.data && typeof candidate.data === 'object' && 'customers' in candidate.data) {
    return candidate.data as CRMCustomerProfilesResponse
  }

  if ('customers' in candidate) {
    return candidate as CRMCustomerProfilesResponse
  }

  return null
}

export const crmCustomerProfilesService = {
  async getCustomerProfiles(filters?: { search?: string; customerId?: string }): Promise<CRMCustomerProfilesResponse> {
    const response = await apiClient.get('/crm/customer-profiles', {
      params: filters,
    })

    const parsed = toCustomerProfilesData(response.data)

    if (!parsed) {
      throw new Error('Invalid customer profiles payload')
    }

    return parsed
  },
}
