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

export const mockOrders: Order[] = Array.from({ length: 12 }, (_, idx) => {
  const n = idx + 1;
  const platform = platforms[idx % platforms.length];
  const status = statuses[idx % statuses.length];

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
    createdAt_platform: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T03:00:00Z`,
    updatedAt_platform: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T03:30:00Z`,
    createdAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T04:00:00Z`,
    updatedAt: `2026-03-${String((n % 28) + 1).padStart(2, "0")}T04:30:00Z`,
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
        promisedShippingTime: `2026-04-${String((n % 28) + 1).padStart(2, "0")}T12:00:00Z`,
        isFulfilledByPlatform: n % 2 === 0,
        isDigital: false,
        returnStatus: undefined,
        cancelReason: status === "Cancelled" ? "Buyer requested" : undefined,
      },
    ],
  };
});
