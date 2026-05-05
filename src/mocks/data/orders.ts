import type { Order } from "@/types/order.types";
import type { PlatformCode } from "@/types/platform.types";
import { mockProducts } from "./products";

const platforms: PlatformCode[] = ["lazada", "shopee", "tiktok_shop"];

// Buyer profiles for consistent order data
const buyerProfiles = [
  {
    id: "buyer-001",
    firstName: "Nguyễn",
    lastName: "Văn A",
    email: "nguyen.a@mail.vn",
    phone: "0901234567",
    city: "Ho Chi Minh",
  },
  {
    id: "buyer-002",
    firstName: "Trần",
    lastName: "Thị B",
    email: "tran.b@mail.vn",
    phone: "0902345678",
    city: "Ha Noi",
  },
  {
    id: "buyer-003",
    firstName: "Phạm",
    lastName: "Minh C",
    email: "pham.c@mail.vn",
    phone: "0903456789",
    city: "Da Nang",
  },
  {
    id: "buyer-004",
    firstName: "Hoàng",
    lastName: "Gia D",
    email: "hoang.d@mail.vn",
    phone: "0904567890",
    city: "Ho Chi Minh",
  },
  {
    id: "buyer-005",
    firstName: "Võ",
    lastName: "Hữu E",
    email: "vo.e@mail.vn",
    phone: "0905678901",
    city: "Can Tho",
  },
  {
    id: "buyer-006",
    firstName: "Tô",
    lastName: "Bích F",
    email: "to.f@mail.vn",
    phone: "0906789012",
    city: "Hai Phong",
  },
  {
    id: "buyer-007",
    firstName: "Dương",
    lastName: "Nam G",
    email: "duong.g@mail.vn",
    phone: "0907890123",
    city: "Ho Chi Minh",
  },
  {
    id: "buyer-008",
    firstName: "Nông",
    lastName: "Hoa H",
    email: "nong.h@mail.vn",
    phone: "0908901234",
    city: "Binh Duong",
  },
];

const shipmentProviders = ["GHN", "GHTK", "Viettel Post", "J&T", "Ninja Van"];
const paymentMethods = ["Online", "COD", "Wallet"] as const;

// Balanced status distribution
const statusDistribution = [
  ...Array(15).fill("Pending"),
  ...Array(15).fill("Confirmed"),
  ...Array(12).fill("Packed"),
  ...Array(5).fill("Shipped"),
  ...Array(2).fill("Delivered"),
  ...Array(1).fill("Cancelled"),
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const baseDate = new Date("2026-05-05T00:00:00Z"); // Current date

export const mockOrders: (Order & { buyerProfileId?: string })[] = Array.from(
  { length: 50 },
  (_, idx) => {
    const n = idx + 1;
    const platform = platforms[idx % platforms.length];
    const status = statusDistribution[idx] as Order["status"];
    const buyerProfile = buyerProfiles[idx % buyerProfiles.length];
    
    // Orders spread over past 30 days (more recent = higher index)
    const daysAgo = Math.floor((n - 1) / 2); // ~2 orders per day
    const orderDate = new Date(baseDate.getTime() - daysAgo * DAY_IN_MS);
    orderDate.setHours(6 + (n % 18), (n * 13) % 60, (n * 7) % 60);

    const createdAtPlatform = new Date(orderDate);
    createdAtPlatform.setMinutes(createdAtPlatform.getMinutes() + 3);
    
    const updatedAtPlatform = new Date(createdAtPlatform);
    const hoursAddedPlatform = status === "Pending" ? 0 : status === "Confirmed" ? 2 : status === "Packed" ? 5 : status === "Shipped" ? 8 : 20;
    updatedAtPlatform.setHours(updatedAtPlatform.getHours() + hoursAddedPlatform);

    const createdAt = new Date(orderDate);
    const updatedAt = new Date(createdAt);
    const hoursAdded = status === "Pending" ? 0.5 : status === "Confirmed" ? 2 : status === "Packed" ? 6 : status === "Shipped" ? 12 : 24;
    updatedAt.setHours(updatedAt.getHours() + hoursAdded);

    const promisedShippingTime = new Date(orderDate.getTime() + (2 + ((n + 1) % 3)) * DAY_IN_MS);

    // Select 1-3 products per order (more deterministic)
    const productsPerOrder = n % 5 === 0 ? 1 : n % 3 === 0 ? 3 : 2;
    const selectedProducts = [];
    for (let i = 0; i < productsPerOrder; i++) {
      const productIdx = ((n - 1) * 7 + i * 13) % mockProducts.length;
      selectedProducts.push(mockProducts[productIdx]);
    }

    // Calculate order totals from products
    let orderTotal = 0;
    const items = selectedProducts.map((product, itemIdx) => {
      const variant = product.variants[0]; // Use first variant
      const qty = n % 7 === 0 ? 2 : 1;
      const itemPrice = variant.salePrice || variant.basePrice;
      
      // Voucher logic (only certain orders)
      const discountPercent = n % 5 === 0 ? 10 : n % 11 === 0 ? 5 : 0;
      const paidPrice = Math.floor(itemPrice * (1 - discountPercent / 100));
      const voucherAmount = itemPrice - paidPrice;

      const itemTotal = paidPrice * qty;
      orderTotal += itemTotal;

      return {
        id: `item-${String(n).padStart(3, "0")}-${String(itemIdx + 1).padStart(2, "0")}`,
        orderId: `ord-${String(n).padStart(3, "0")}`,
        productId: product.id,
        variantId: variant.id,
        externalOrderItemId: `external-item-${n}-${itemIdx + 1}`,
        externalSkuRef: variant.internalSku,
        productName: product.name,
        variantAttributes: `${
          variant.attributesJson
            ? Object.values(variant.attributesJson).join(" / ")
            : variant.name
        }`,
        qty,
        itemPrice,
        paidPrice,
        voucherAmount: voucherAmount > 0 ? voucherAmount : undefined,
        shippingFeeOriginal: itemIdx === 0 ? 25000 : undefined,
        currency: "VND",
        status,
        trackingCode: `TRACK-${String(n).padStart(3, "0")}-${String(itemIdx + 1).padStart(2, "0")}`,
        shipmentProvider: shipmentProviders[n % shipmentProviders.length],
        promisedShippingTime: promisedShippingTime.toISOString(),
        isFulfilledByPlatform: n % 2 === 0,
        isDigital: false,
        returnStatus: status === "Delivered" && n % 15 === 0 ? "initiated" : undefined,
        cancelReason: status === "Cancelled" ? (n % 2 === 0 ? "Buyer requested" : "Out of stock") : undefined,
      };
    });

    // Add shipping fee to total
    const shippingFee = items[0].shippingFeeOriginal || 0;
    const finalTotal = orderTotal + shippingFee;

    return {
      id: `ord-${String(n).padStart(3, "0")}`,
      sellerId: "seller-001",
      buyerProfileId: buyerProfile.id,
      connectionId: `pc-${String((n % 3) + 1).padStart(3, "0")}`,
      platform,
      externalOrderId: `external-order-${n}`,
      externalOrderNumber: `${platform.toUpperCase()}-${String(1000 + n)}`,
      paymentMethod: paymentMethods[n % paymentMethods.length],
      totalAmount: finalTotal,
      currency: "VND",
      status,
      giftOption: n % 6 === 0,
      giftMessage: n % 6 === 0 ? "Tặng yêu thương" : undefined,
      voucherCode: n % 8 === 0 ? "SALE10" : n % 12 === 0 ? "WELCOME5" : undefined,
      buyerFirstName: buyerProfile.firstName,
      buyerLastName: buyerProfile.lastName,
      buyerPhone: buyerProfile.phone,
      buyerEmail: buyerProfile.email,
      shippingAddress: `${String(n * 3 + 5).padStart(3, "0")} Nguyễn Huệ, Quận 1`,
      shippingCity: buyerProfile.city,
      shippingPostCode: "700000",
      shippingCountry: "VN",
      source: n % 2 === 0 ? "platform_sync" : "platform_webhook",
      isDeleted: false,
      createdAt_platform: createdAtPlatform.toISOString(),
      updatedAt_platform: updatedAtPlatform.toISOString(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      items,
    };
  }
);
