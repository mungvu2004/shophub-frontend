import type { PlatformCode } from "./platform.types";

export type OrderStatus =
  | "Pending"
  | "PendingPayment"
  | "Confirmed"
  | "Packed"
  | "ReadyToShip"
  | "Shipped"
  | "Delivered"
  | "FailedDelivery"
  | "Cancelled"
  | "Returned"
  | "Refunded"
  | "Lost"; // Source: Orders.Status | nullable: no

export interface Order {
  id: string; // Source: Orders.Id | nullable: no
  sellerId: string; // Source: Orders.SellerId | nullable: no
  connectionId: string; // Source: Orders.ConnectionId | nullable: no
  platform: PlatformCode; // Source: Orders.Platform | nullable: no
  externalOrderId: string; // Source: Orders.ExternalOrderId | nullable: no
  externalOrderNumber?: string; // Source: Orders.ExternalOrderNumber | nullable: yes
  paymentMethod?: "COD" | "Online" | "Wallet"; // Source: Orders.PaymentMethod | nullable: yes
  totalAmount: number; // Source: Orders.TotalAmount | nullable: no
  currency: string; // Source: Orders.Currency | nullable: no
  status: OrderStatus; // Source: Orders.Status | nullable: no
  giftOption: boolean; // Source: Orders.GiftOption | nullable: no
  giftMessage?: string; // Source: Orders.GiftMessage | nullable: yes
  voucherCode?: string; // Source: Orders.VoucherCode | nullable: yes
  buyerFirstName?: string; // Source: Orders.BuyerFirstName | nullable: yes
  buyerLastName?: string; // Source: Orders.BuyerLastName | nullable: yes
  buyerPhone?: string; // Source: Orders.BuyerPhone | nullable: yes
  buyerEmail?: string; // Source: Orders.BuyerEmail | nullable: yes
  shippingAddress?: string; // Source: Orders.ShippingAddress | nullable: yes
  shippingCity?: string; // Source: Orders.ShippingCity | nullable: yes
  shippingPostCode?: string; // Source: Orders.ShippingPostCode | nullable: yes
  shippingCountry?: string; // Source: Orders.ShippingCountry | nullable: yes
  source: "platform_sync" | "platform_webhook" | "manual"; // Source: Orders.Source | nullable: no
  isDeleted: boolean; // Source: Orders.IsDeleted | nullable: no
  createdAt_platform: string; // Source: Orders.CreatedAt_Platform | nullable: no
  updatedAt_platform: string; // Source: Orders.UpdatedAt_Platform | nullable: no
  createdAt: string; // Source: Orders.CreatedAt | nullable: no
  updatedAt: string; // Source: Orders.UpdatedAt | nullable: no
  items?: OrderItem[]; // Source: Joined OrderItems records | nullable: yes
}

export interface OrderItem {
  id: string; // Source: OrderItems.Id | nullable: no
  orderId: string; // Source: OrderItems.OrderId | nullable: no
  productId?: string; // Product ID from sync/match - helps with product lookup
  variantId?: string; // Source: OrderItems.VariantId | nullable: yes
  externalOrderItemId: string; // Source: OrderItems.ExternalOrderItemId | nullable: no
  externalSkuRef?: string; // Source: OrderItems.ExternalSkuRef | nullable: yes
  productName: string; // Source: OrderItems.ProductName | nullable: no
  variantAttributes?: string; // Source: OrderItems.VariantAttributes | nullable: yes
  qty: number; // Source: OrderItems.Qty | nullable: no
  itemPrice: number; // Source: OrderItems.ItemPrice | nullable: no
  paidPrice: number; // Source: OrderItems.PaidPrice | nullable: no
  voucherAmount?: number; // Source: OrderItems.VoucherAmount | nullable: yes
  shippingFeeOriginal?: number; // Source: OrderItems.ShippingFeeOriginal | nullable: yes
  currency?: string; // Source: OrderItems.Currency | nullable: yes
  status: OrderStatus; // Source: OrderItems.Status | nullable: no
  trackingCode?: string; // Source: OrderItems.TrackingCode | nullable: yes
  shipmentProvider?: string; // Source: OrderItems.ShipmentProvider | nullable: yes
  promisedShippingTime?: string; // Source: OrderItems.PromisedShippingTime | nullable: yes
  isFulfilledByPlatform: boolean; // Source: OrderItems.IsFulfilledByPlatform | nullable: no
  isDigital: boolean; // Source: OrderItems.IsDigital | nullable: no
  returnStatus?: string; // Source: OrderItems.ReturnStatus | nullable: yes
  cancelReason?: string; // Source: OrderItems.CancelReason | nullable: yes
}

export interface OrderStatusHistory {
  id: number; // Source: OrderStatusHistory.Id | nullable: no
  orderId: string; // Source: OrderStatusHistory.OrderId | nullable: no
  orderItemId?: string; // Source: OrderStatusHistory.OrderItemId | nullable: yes
  oldStatus?: OrderStatus; // Source: OrderStatusHistory.OldStatus | nullable: yes
  newStatus: OrderStatus; // Source: OrderStatusHistory.NewStatus | nullable: no
  platformStatus?: string; // Source: OrderStatusHistory.PlatformStatus | nullable: yes
  source: "platform_webhook" | "platform_sync" | "reconciliation" | "manual"; // Source: OrderStatusHistory.Source | nullable: no
  webhookInboxId?: number; // Source: OrderStatusHistory.WebhookInboxId | nullable: yes
  externalRequestId?: string; // Source: OrderStatusHistory.ExternalRequestId | nullable: yes
  note?: string; // Source: OrderStatusHistory.Note | nullable: yes
  changedAt: string; // Source: OrderStatusHistory.ChangedAt | nullable: no
}
