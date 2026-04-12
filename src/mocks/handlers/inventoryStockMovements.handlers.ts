import { http, HttpResponse } from 'msw'

import { buildInventoryStockMovementsResponse } from '@/mocks/data/inventoryStockMovements'

export const inventoryStockMovementsHandlers = [
  http.get('/api/inventory/stock-movements', ({ request }) => {
    const url = new URL(request.url)

    const payload = buildInventoryStockMovementsResponse({
      search: url.searchParams.get('search') ?? undefined,
      platform: (url.searchParams.get('platform') as 'lazada' | 'shopee' | 'tiktok_shop' | undefined) ?? undefined,
      movementGroup:
        (url.searchParams.get('movementGroup') as 'all' | 'inbound' | 'outbound' | 'transfer' | 'order' | 'adjustment' | 'loss' | undefined) ?? undefined,
      warehouseId: url.searchParams.get('warehouseId') ?? undefined,
      page: Number(url.searchParams.get('page') ?? 1),
      pageSize: Number(url.searchParams.get('pageSize') ?? 10),
    })

    return HttpResponse.json(payload, { status: 200 })
  }),
]