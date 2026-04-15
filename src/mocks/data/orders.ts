import type { Order } from "@/types/order.types";
import type { PlatformCode } from "@/types/platform.types";

const platforms: PlatformCode[] = ["lazada", "shopee", "tiktok_shop"];
const statuses: Order["status"][] = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const DAY_IN_MS = 24 * 60 * 60 * 1000
const baseDate = new Date()
baseDate.setHours(12, 0, 0, 0)

export const mockOrders: Order[] = Array.from({ length: 12 }, (_, idx) => {
  const n = idx + 1;
  const platform = platforms[idx % platforms.length];
  const status = statuses[idx % statuses.length];
  const orderDate = new Date(baseDate.getTime() - idx * DAY_IN_MS)
  const createdAtPlatform = new Date(orderDate)
  createdAtPlatform.setHours(3, 0, 0, 0)
  const updatedAtPlatform = new Date(orderDate)
  updatedAtPlatform.setHours(3, 30, 0, 0)
  const createdAt = new Date(orderDate)
  createdAt.setHours(4, 0, 0, 0)
  const updatedAt = new Date(orderDate)
  updatedAt.setHours(4, 30, 0, 0)
  const promisedShippingTime = new Date(orderDate.getTime() + 2 * DAY_IN_MS)

  return {
    id: `ord-${String(n).padStart(3, "0")}`,
    sellerId: "seller-001",
    connectionId: `pc-${String((n % 4) + 1).padStart(3, "0")}`,
    platform,
    externalOrderId: `external-order-${n}`,
    externalOrderNumber: `SO-${String(1000 + n)}`,
    paymentMethod: n % 2 === 0 ? "COD" : "Online",
    totalAmount: 150000 + n * 10000,
    currency: "VND",
    status,
    giftOption: n % 3 === 0,
    giftMessage: n % 3 === 0 ? "Gift wrap please" : undefined,
    voucherCode: n % 4 === 0 ? "SALE10" : undefined,
    buyerFirstName: `Buyer${n}`,
    buyerLastName: "Demo",
    buyerPhone: `09000000${String(n).padStart(2, "0")}`,
    buyerEmail: `buyer${n}@mail.local`,
    shippingAddress: `${n} Demo Street, Ward 1`,
    shippingCity: "HCM",
    shippingPostCode: "700000",
    shippingCountry: "VN",
    source: n % 2 === 0 ? "platform_sync" : "platform_webhook",
    isDeleted: false,
    createdAt_platform: createdAtPlatform.toISOString(),
    updatedAt_platform: updatedAtPlatform.toISOString(),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    items: [
      {
        id: `item-${String(n).padStart(3, "0")}-1`,
        orderId: `ord-${String(n).padStart(3, "0")}`,
        variantId: `var-${String(n).padStart(3, "0")}-1`,
        externalOrderItemId: `external-item-${n}`,
        externalSkuRef: `SKU-${String(n).padStart(4, "0")}`,
        productName: `Demo Product ${n}`,
        variantAttributes: "Black / M",
        qty: n % 2 === 0 ? 1 : 2,
        itemPrice: 100000,
        paidPrice: 95000,
        voucherAmount: 5000,
        shippingFeeOriginal: 15000,
        currency: "VND",
        status,
        trackingCode: `TRACK-${n}`,
        shipmentProvider: "GHN",
        promisedShippingTime: promisedShippingTime.toISOString(),
        isFulfilledByPlatform: n % 2 === 0,
        isDigital: false,
        returnStatus: undefined,
        cancelReason: status === "Cancelled" ? "Buyer requested" : undefined,
      },
    ],
  };
});
