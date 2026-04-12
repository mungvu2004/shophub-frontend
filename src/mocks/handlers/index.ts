import { authHandlers } from "./auth.handlers";
import { productsHandlers } from "./products.handlers";
import { ordersHandlers } from "./orders.handlers";
import { inventoryHandlers } from "./inventory.handlers";
import { platformHandlers } from "./platforms.handlers";
import { notificationsHandlers } from "./notifications.handlers";
import { dashboardHandlers } from "./dashboard.handlers";
import { revenueHandlers } from "./revenue.handlers";
import { assetsHandlers } from "./assets.handlers";
import { crmHandlers } from "./crm.handlers";
import { settingsHandlers } from "./settings.handlers";
import { inventoryStockMovementsHandlers } from "./inventoryStockMovements.handlers";
import { footerHandlers } from './footer.handlers'

export const handlers = [
  ...authHandlers,
  ...productsHandlers,
  ...ordersHandlers,
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
];
