import { http, HttpResponse } from 'msw'
import { authHandlers } from "./auth.handlers";
import { productsHandlers } from "@/features/products/handlers/products.handlers";
import { ordersHandlers as ordersFeatureHandlers } from "@/features/orders/handlers/orders.handlers";
import { inventoryHandlers } from "@/features/inventory/handlers/inventory.handlers";
import { platformHandlers } from "./platforms.handlers";
import { notificationsHandlers } from "./notifications.handlers";
import { dashboardHandlers } from "./dashboard.handlers";
import { revenueHandlers } from "./revenue.handlers";
import { assetsHandlers } from "./assets.handlers";
import { crmHandlers } from "@/features/crm/handlers/crm.handlers";
import { settingsHandlers } from "./settings.handlers";
import { inventoryStockMovementsHandlers } from "./inventoryStockMovements.handlers";
import { footerHandlers } from './footer.handlers'

export const handlers = [
  ...authHandlers,
  ...productsHandlers,
  ...ordersFeatureHandlers,
  ...inventoryHandlers,
  ...platformHandlers,
  ...notificationsHandlers,
  ...dashboardHandlers,
  ...revenueHandlers,
  ...assetsHandlers,
  ...crmHandlers,
  ...settingsHandlers,
  ...inventoryStockMovementsHandlers,
  ...footerHandlers,

  // Catch-all cho toàn bộ /api/* để tránh lỗi "Failed to fetch" khi thiếu handler
  http.all('/api/*', ({ request }) => {
    console.warn(`[MSW] Unhandled request: ${request.method} ${request.url}`)
    return HttpResponse.json(
      { 
        success: false, 
        message: `API Mock không tồn tại: ${request.method} ${new URL(request.url).pathname}` 
      },
      { status: 404 }
    )
  }),
];
