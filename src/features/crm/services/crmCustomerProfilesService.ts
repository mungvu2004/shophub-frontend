import { apiClient } from '@/services/apiClient'
import type {
  CRMCustomerCreatePayload,
  CRMCustomerProfileDetail,
  CRMCustomerProfilesResponse,
  CRMCustomerSegmentKey,
  CRMCustomerUpdatePayload,
} from '@/types/crm.types'

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

const toCustomerDetail = (payload: unknown): CRMCustomerProfileDetail | null => {
  if (!payload || typeof payload !== 'object') return null
  const candidate = payload as { data?: CRMCustomerProfileDetail } & CRMCustomerProfileDetail
  if (candidate.data && typeof candidate.data === 'object' && 'id' in candidate.data) {
    return candidate.data
  }
  if ('id' in candidate) return candidate as CRMCustomerProfileDetail
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

  async createCustomer(payload: CRMCustomerCreatePayload): Promise<CRMCustomerProfileDetail> {
    const response = await apiClient.post('/crm/customer-profiles', payload)
    const parsed = toCustomerDetail(response.data)
    if (!parsed) throw new Error('Invalid create customer payload')
    return parsed
  },

  async updateCustomer(id: string, payload: CRMCustomerUpdatePayload): Promise<CRMCustomerProfileDetail> {
    const response = await apiClient.patch(`/crm/customer-profiles/${id}`, payload)
    const parsed = toCustomerDetail(response.data)
    if (!parsed) throw new Error('Invalid update customer payload')
    return parsed
  },

  async deleteCustomer(id: string): Promise<{ deletedId: string }> {
    const response = await apiClient.delete(`/crm/customer-profiles/${id}`)
    const candidate = response.data as { data?: { deletedId: string } } & { deletedId?: string }
    if (candidate.data && 'deletedId' in candidate.data) return candidate.data
    if (candidate.deletedId) return { deletedId: candidate.deletedId }
    return { deletedId: id }
  },

  async changeCustomerSegment(id: string, segment: CRMCustomerSegmentKey): Promise<CRMCustomerProfileDetail> {
    const response = await apiClient.patch(`/crm/customer-profiles/${id}/segment`, { segment })
    const parsed = toCustomerDetail(response.data)
    if (!parsed) throw new Error('Invalid segment change payload')
    return parsed
  },
}
