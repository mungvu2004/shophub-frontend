import type { StockLevel } from '@/types/inventory.types'
import type { InventoryTableRow } from './inventoryTable.types'

function getPlatformType(stockLevel: StockLevel): string {
  const channels = [
    { key: 'Shopee', qty: stockLevel.channelStock?.shopee || 0 },
    { key: 'TikTok', qty: stockLevel.channelStock?.tiktok || 0 },
    { key: 'Lazada', qty: stockLevel.channelStock?.lazada || 0 },
  ]

  const activeChannels = channels.filter((channel) => channel.qty > 0)
  if (activeChannels.length === 0) return 'Chua len san'
  if (activeChannels.length > 1) return 'Da san'
  return activeChannels[0].key
}

/**
 * Map StockLevel từ API thành InventoryTableRow để hiển thị
 */
export function mapStockLevelToTableRow(stockLevel: StockLevel & { avgDailySales?: number; forecastDays?: number; isDiscontinued?: boolean; maxCapacity?: number }): InventoryTableRow {
  const matched = stockLevel.variantId.match(/^var-(\d+)-/)
  const productId = matched ? `prod-${matched[1]}` : undefined
  const actualStock = stockLevel.physicalQty || 0
  const available = stockLevel.availableQty || 0

  return {
    id: stockLevel.id,
    productId,
    variantId: stockLevel.variantId,
    warehouseId: stockLevel.warehouseId,
    sku: stockLevel.sku,
    productName: stockLevel.productName || stockLevel.variantName || 'Unknown',
    category: stockLevel.category || 'Uncategorized',
    platformType: getPlatformType(stockLevel),
    shopeeStock: stockLevel.channelStock?.shopee || 0,
    tiktokStock: stockLevel.channelStock?.tiktok || 0,
    lazadaStock: stockLevel.channelStock?.lazada || 0,
    warehouseHN: Math.floor(actualStock * 0.4),
    warehouseHCM: Math.floor(actualStock * 0.4),
    warehouseDN: actualStock - Math.floor(actualStock * 0.4) - Math.floor(actualStock * 0.4),
    actualStock,
    onOrder: stockLevel.onOrder || 0,
    available,
    status: getStockStatus(available, actualStock, stockLevel.isDiscontinued),
    restockDays: getRestockDays(actualStock, stockLevel.avgDailySales, stockLevel.forecastDays),
    avgDailySales: stockLevel.avgDailySales,
    forecastDays: stockLevel.forecastDays,
    isDiscontinued: stockLevel.isDiscontinued,
    maxCapacity: stockLevel.maxCapacity || 100,
    image: stockLevel.productImage,
  }
}

/**
 * Xác định trạng thái tồn kho dựa vào available quantity
 */
export function getStockStatus(available: number, physical: number, isDiscontinued?: boolean): 'normal' | 'warning' | 'critical' | 'discontinued' {
  if (isDiscontinued) return 'discontinued'
  if (physical === 0 || available < 0) return 'critical'
  if (available <= 10) return 'warning'
  return 'normal'
}

/**
 * Tính dự báo ngày hết hàng dựa vào tốc độ bán và lượng tồn kho
 */
export function getRestockDays(stock: number, avgDailySales?: number, forecastDays?: number): string {
  // Nếu có dữ liệu dự báo từ AI, ưu tiên dùng
  if (forecastDays !== undefined) {
    if (forecastDays <= 3) return '<7 ngày'
    if (forecastDays <= 14) return '7-14 ngày'
    return '>14 ngày'
  }
  
  // Fallback: tính dựa vào tốc độ bán nếu có
  if (avgDailySales && avgDailySales > 0) {
    const daysRemaining = Math.floor(stock / avgDailySales)
    if (daysRemaining <= 3) return '<7 ngày'
    if (daysRemaining <= 14) return '7-14 ngày'
    return '>14 ngày'
  }
  
  // Fallback cuối cùng: chỉ dựa vào số lượng tuyệt đối (legacy logic)
  if (stock === 0) return '<7 ngày'
  if (stock < 30) return '7-14 ngày'
  return '>14 ngày'
}
