import { http, HttpResponse } from 'msw'

import { buildInventoryStockMovementsResponse } from '@/mocks/data/inventoryStockMovements'

export const inventoryStockMovementsHandlers = [
  http.get('/api/inventory/stock-movements', ({ request }) => {
    const url = new URL(request.url)

    const platform = url.searchParams.get('platform')
    const movementGroup = url.searchParams.get('movementGroup')
    const warehouseId = url.searchParams.get('warehouseId')

    const payload = buildInventoryStockMovementsResponse({
      search: url.searchParams.get('search') ?? undefined,
      platform: (platform === 'all' ? undefined : platform as any) ?? undefined,
      movementGroup: (movementGroup === 'all' ? undefined : movementGroup as any) ?? undefined,
      warehouseId: (warehouseId === 'all' ? undefined : warehouseId) ?? undefined,
      page: Number(url.searchParams.get('page') ?? 1),
      pageSize: Number(url.searchParams.get('pageSize') ?? 10),
    })

    return HttpResponse.json(payload, { status: 200 })
  }),
]