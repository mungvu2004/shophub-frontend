/**
 * Stock batch data for top 20 SKUs with realistic batch numbers, dates, and costs
 * Generated from purchase orders and receiving history
 */
import type { StockBatch, CostHistoryEntry, ReorderConfig } from '@/types/inventory.types'

export const mockSKUBatches: Record<string, StockBatch[]> = {
  'SKU-001': [
    {
      id: 'B1-001',
      sku: 'SKU-001',
      batchNumber: 'LOT-2026-AP-001',
      quantity: 120,
      expiryDate: '2027-12-31',
      receivedDate: '2026-05-05',
      costPrice: 30000,
      warehouseId: 'wh-002',
    },
    {
      id: 'B1-002',
      sku: 'SKU-001',
      batchNumber: 'LOT-2026-AP-002',
      quantity: 85,
      expiryDate: '2027-11-30',
      receivedDate: '2026-05-05',
      costPrice: 31000,
      warehouseId: 'wh-001',
    },
  ],
  'SKU-003': [
    {
      id: 'B3-001',
      sku: 'SKU-003',
      batchNumber: 'LOT-2026-05-001',
      quantity: 95,
      expiryDate: '2027-10-15',
      receivedDate: '2026-05-05',
      costPrice: 42000,
      warehouseId: 'wh-002',
    },
  ],
  'SKU-005': [
    {
      id: 'B5-001',
      sku: 'SKU-005',
      batchNumber: 'LOT-2026-05-001',
      quantity: 110,
      expiryDate: '2027-09-20',
      receivedDate: '2026-05-05',
      costPrice: 48000,
      warehouseId: 'wh-001',
    },
  ],
  'SKU-008': [
    {
      id: 'B8-001',
      sku: 'SKU-008',
      batchNumber: 'LOT-2026-08-001',
      quantity: 75,
      expiryDate: '2027-08-30',
      receivedDate: '2026-05-05',
      costPrice: 55000,
      warehouseId: 'wh-001',
    },
  ],
  'SKU-010': [
    {
      id: 'B10-001',
      sku: 'SKU-010',
      batchNumber: 'LOT-2026-10-001',
      quantity: 140,
      expiryDate: '2027-12-31',
      receivedDate: '2026-05-05',
      costPrice: 36000,
      warehouseId: 'wh-002',
    },
  ],
  'SKU-012': [
    {
      id: 'B12-001',
      sku: 'SKU-012',
      batchNumber: 'LOT-2026-12-001',
      quantity: 88,
      expiryDate: '2027-07-25',
      receivedDate: '2026-05-05',
      costPrice: 65000,
      warehouseId: 'wh-001',
    },
  ],
  'SKU-015': [
    {
      id: 'B15-001',
      sku: 'SKU-015',
      batchNumber: 'LOT-2026-15-001',
      quantity: 102,
      expiryDate: '2027-09-10',
      receivedDate: '2026-05-05',
      costPrice: 52000,
      warehouseId: 'wh-001',
    },
  ],
  'SKU-018': [
    {
      id: 'B18-001',
      sku: 'SKU-018',
      batchNumber: 'LOT-2026-18-001',
      quantity: 96,
      expiryDate: '2027-11-15',
      receivedDate: '2026-05-05',
      costPrice: 44000,
      warehouseId: 'wh-002',
    },
  ],
  'SKU-020': [
    {
      id: 'B20-001',
      sku: 'SKU-020',
      batchNumber: 'LOT-2026-20-001',
      quantity: 115,
      expiryDate: '2027-10-20',
      receivedDate: '2026-05-05',
      costPrice: 38000,
      warehouseId: 'wh-001',
    },
  ],
  'SKU-022': [
    {
      id: 'B22-001',
      sku: 'SKU-022',
      batchNumber: 'LOT-2026-22-001',
      quantity: 82,
      expiryDate: '2027-08-15',
      receivedDate: '2026-05-05',
      costPrice: 58000,
      warehouseId: 'wh-001',
    },
  ],
  'SKU-025': [
    {
      id: 'B25-001',
      sku: 'SKU-025',
      batchNumber: 'LOT-2026-25-001',
      quantity: 105,
      expiryDate: '2027-12-10',
      receivedDate: '2026-05-05',
      costPrice: 71000,
      warehouseId: 'wh-002',
    },
  ],
  'SKU-028': [
    {
      id: 'B28-001',
      sku: 'SKU-028',
      batchNumber: 'LOT-2026-28-001',
      quantity: 92,
      expiryDate: '2027-09-05',
      receivedDate: '2026-05-05',
      costPrice: 49000,
      warehouseId: 'wh-001',
    },
  ],
  'SKU-030': [
    {
      id: 'B30-001',
      sku: 'SKU-030',
      batchNumber: 'LOT-2026-30-001',
      quantity: 108,
      expiryDate: '2027-11-20',
      receivedDate: '2026-05-05',
      costPrice: 62000,
      warehouseId: 'wh-001',
    },
  ],
  'SKU-032': [
    {
      id: 'B32-001',
      sku: 'SKU-032',
      batchNumber: 'LOT-2026-32-001',
      quantity: 78,
      expiryDate: '2027-07-30',
      receivedDate: '2026-05-05',
      costPrice: 54000,
      warehouseId: 'wh-002',
    },
  ],
  'SKU-035': [
    {
      id: 'B35-001',
      sku: 'SKU-035',
      batchNumber: 'LOT-2026-35-001',
      quantity: 118,
      expiryDate: '2027-10-25',
      receivedDate: '2026-05-05',
      costPrice: 47000,
      warehouseId: 'wh-001',
    },
  ],
  'SKU-038': [
    {
      id: 'B38-001',
      sku: 'SKU-038',
      batchNumber: 'LOT-2026-38-001',
      quantity: 87,
      expiryDate: '2027-08-10',
      receivedDate: '2026-05-05',
      costPrice: 68000,
      warehouseId: 'wh-001',
    },
  ],
  'SKU-040': [
    {
      id: 'B40-001',
      sku: 'SKU-040',
      batchNumber: 'LOT-2026-40-001',
      quantity: 100,
      expiryDate: '2027-12-05',
      receivedDate: '2026-05-05',
      costPrice: 41000,
      warehouseId: 'wh-002',
    },
  ],
  'SKU-042': [
    {
      id: 'B42-001',
      sku: 'SKU-042',
      batchNumber: 'LOT-2026-42-001',
      quantity: 93,
      expiryDate: '2027-09-18',
      receivedDate: '2026-05-05',
      costPrice: 56000,
      warehouseId: 'wh-001',
    },
  ],
  'SKU-045': [
    {
      id: 'B45-001',
      sku: 'SKU-045',
      batchNumber: 'LOT-2026-45-001',
      quantity: 111,
      expiryDate: '2027-11-08',
      receivedDate: '2026-05-05',
      costPrice: 64000,
      warehouseId: 'wh-001',
    },
  ],
};

/**
 * Cost history tracking price changes over time for top 20 SKUs
 * Shows weighted average cost updates from purchase orders
 */
export const mockCostHistory: Record<string, CostHistoryEntry[]> = {
  'SKU-001': [
    { id: 'C1-001', sku: 'SKU-001', date: '2026-02-01', costPrice: 28000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-001' },
    { id: 'C1-002', sku: 'SKU-001', date: '2026-03-01', costPrice: 29500, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-015' },
    { id: 'C1-003', sku: 'SKU-001', date: '2026-04-01', costPrice: 30000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-028' },
    { id: 'C1-004', sku: 'SKU-001', date: '2026-04-20', costPrice: 31000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-042' },
  ],
  'SKU-003': [
    { id: 'C3-001', sku: 'SKU-003', date: '2026-02-01', costPrice: 40000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-002' },
    { id: 'C3-002', sku: 'SKU-003', date: '2026-03-15', costPrice: 41500, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-020' },
    { id: 'C3-003', sku: 'SKU-003', date: '2026-04-10', costPrice: 42000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-035' },
  ],
  'SKU-005': [
    { id: 'C5-001', sku: 'SKU-005', date: '2026-01-15', costPrice: 45000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-005' },
    { id: 'C5-002', sku: 'SKU-005', date: '2026-02-20', costPrice: 46500, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-010' },
    { id: 'C5-003', sku: 'SKU-005', date: '2026-03-28', costPrice: 47200, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-022' },
    { id: 'C5-004', sku: 'SKU-005', date: '2026-04-15', costPrice: 48000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-040' },
  ],
  'SKU-008': [
    { id: 'C8-001', sku: 'SKU-008', date: '2026-02-10', costPrice: 52000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-008' },
    { id: 'C8-002', sku: 'SKU-008', date: '2026-03-20', costPrice: 53500, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-025' },
    { id: 'C8-003', sku: 'SKU-008', date: '2026-04-12', costPrice: 55000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-038' },
  ],
  'SKU-010': [
    { id: 'C10-001', sku: 'SKU-010', date: '2026-01-20', costPrice: 33000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-003' },
    { id: 'C10-002', sku: 'SKU-010', date: '2026-02-28', costPrice: 34500, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-012' },
    { id: 'C10-003', sku: 'SKU-010', date: '2026-03-25', costPrice: 35200, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-030' },
    { id: 'C10-004', sku: 'SKU-010', date: '2026-04-18', costPrice: 36000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-045' },
  ],
  'SKU-012': [
    { id: 'C12-001', sku: 'SKU-012', date: '2026-02-05', costPrice: 62000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-006' },
    { id: 'C12-002', sku: 'SKU-012', date: '2026-03-10', costPrice: 63500, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-018' },
    { id: 'C12-003', sku: 'SKU-012', date: '2026-04-08', costPrice: 65000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-032' },
  ],
  'SKU-015': [
    { id: 'C15-001', sku: 'SKU-015', date: '2026-02-15', costPrice: 50000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-009' },
    { id: 'C15-002', sku: 'SKU-015', date: '2026-03-22', costPrice: 51000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-026' },
    { id: 'C15-003', sku: 'SKU-015', date: '2026-04-14', costPrice: 52000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-041' },
  ],
  'SKU-018': [
    { id: 'C18-001', sku: 'SKU-018', date: '2026-01-25', costPrice: 42000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-004' },
    { id: 'C18-002', sku: 'SKU-018', date: '2026-02-28', costPrice: 42800, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-013' },
    { id: 'C18-003', sku: 'SKU-018', date: '2026-03-30', costPrice: 43500, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-031' },
    { id: 'C18-004', sku: 'SKU-018', date: '2026-04-16', costPrice: 44000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-046' },
  ],
  'SKU-020': [
    { id: 'C20-001', sku: 'SKU-020', date: '2026-02-08', costPrice: 36500, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-007' },
    { id: 'C20-002', sku: 'SKU-020', date: '2026-03-15', costPrice: 37200, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-023' },
    { id: 'C20-003', sku: 'SKU-020', date: '2026-04-11', costPrice: 38000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-039' },
  ],
  'SKU-022': [
    { id: 'C22-001', sku: 'SKU-022', date: '2026-02-12', costPrice: 56000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-011' },
    { id: 'C22-002', sku: 'SKU-022', date: '2026-03-18', costPrice: 57000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-024' },
    { id: 'C22-003', sku: 'SKU-022', date: '2026-04-05', costPrice: 58000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-033' },
  ],
  'SKU-025': [
    { id: 'C25-001', sku: 'SKU-025', date: '2026-01-30', costPrice: 68000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-014' },
    { id: 'C25-002', sku: 'SKU-025', date: '2026-02-25', costPrice: 69500, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-016' },
    { id: 'C25-003', sku: 'SKU-025', date: '2026-03-28', costPrice: 70200, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-027' },
    { id: 'C25-004', sku: 'SKU-025', date: '2026-04-22', costPrice: 71000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-050' },
  ],
  'SKU-028': [
    { id: 'C28-001', sku: 'SKU-028', date: '2026-02-18', costPrice: 47000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-017' },
    { id: 'C28-002', sku: 'SKU-028', date: '2026-03-20', costPrice: 48000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-029' },
    { id: 'C28-003', sku: 'SKU-028', date: '2026-04-13', costPrice: 49000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-044' },
  ],
  'SKU-030': [
    { id: 'C30-001', sku: 'SKU-030', date: '2026-02-20', costPrice: 59500, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-019' },
    { id: 'C30-002', sku: 'SKU-030', date: '2026-03-25', costPrice: 60500, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-034' },
    { id: 'C30-003', sku: 'SKU-030', date: '2026-04-19', costPrice: 62000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-047' },
  ],
  'SKU-032': [
    { id: 'C32-001', sku: 'SKU-032', date: '2026-02-03', costPrice: 52000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-021' },
    { id: 'C32-002', sku: 'SKU-032', date: '2026-03-12', costPrice: 53000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-036' },
    { id: 'C32-003', sku: 'SKU-032', date: '2026-04-06', costPrice: 54000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-049' },
  ],
  'SKU-035': [
    { id: 'C35-001', sku: 'SKU-035', date: '2026-02-22', costPrice: 45000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-037' },
    { id: 'C35-002', sku: 'SKU-035', date: '2026-03-28', costPrice: 46000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-043' },
    { id: 'C35-003', sku: 'SKU-035', date: '2026-04-20', costPrice: 47000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-048' },
  ],
  'SKU-038': [
    { id: 'C38-001', sku: 'SKU-038', date: '2026-02-14', costPrice: 66000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-051' },
    { id: 'C38-002', sku: 'SKU-038', date: '2026-03-22', costPrice: 67000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-052' },
    { id: 'C38-003', sku: 'SKU-038', date: '2026-04-10', costPrice: 68000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-053' },
  ],
  'SKU-040': [
    { id: 'C40-001', sku: 'SKU-040', date: '2026-02-25', costPrice: 39000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-054' },
    { id: 'C40-002', sku: 'SKU-040', date: '2026-03-30', costPrice: 40000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-055' },
    { id: 'C40-003', sku: 'SKU-040', date: '2026-04-21', costPrice: 41000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-056' },
  ],
  'SKU-042': [
    { id: 'C42-001', sku: 'SKU-042', date: '2026-02-28', costPrice: 54000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-057' },
    { id: 'C42-002', sku: 'SKU-042', date: '2026-03-28', costPrice: 55000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-058' },
    { id: 'C42-003', sku: 'SKU-042', date: '2026-04-15', costPrice: 56000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-059' },
  ],
  'SKU-045': [
    { id: 'C45-001', sku: 'SKU-045', date: '2026-02-10', costPrice: 62000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-060' },
    { id: 'C45-002', sku: 'SKU-045', date: '2026-03-18', costPrice: 63000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-061' },
    { id: 'C45-003', sku: 'SKU-045', date: '2026-04-17', costPrice: 64000, method: 'WEIGHTED_AVERAGE', sourceType: 'IMPORT', sourceId: 'PO-2026-062' },
  ],
};

/**
 * Reorder configuration for all tracked SKUs
 * Min threshold triggers auto-reorder, quantity determines reorder amount
 */
export const mockReorderConfigs: Record<string, ReorderConfig> = {
  'SKU-001': { sku: 'SKU-001', minThreshold: 30, reorderQty: 200, isAutoReorder: true },
  'SKU-003': { sku: 'SKU-003', minThreshold: 25, reorderQty: 150, isAutoReorder: true },
  'SKU-005': { sku: 'SKU-005', minThreshold: 35, reorderQty: 180, isAutoReorder: true },
  'SKU-008': { sku: 'SKU-008', minThreshold: 20, reorderQty: 120, isAutoReorder: false },
  'SKU-010': { sku: 'SKU-010', minThreshold: 40, reorderQty: 220, isAutoReorder: true },
  'SKU-012': { sku: 'SKU-012', minThreshold: 25, reorderQty: 140, isAutoReorder: true },
  'SKU-015': { sku: 'SKU-015', minThreshold: 30, reorderQty: 160, isAutoReorder: true },
  'SKU-018': { sku: 'SKU-018', minThreshold: 28, reorderQty: 170, isAutoReorder: true },
  'SKU-020': { sku: 'SKU-020', minThreshold: 32, reorderQty: 190, isAutoReorder: true },
  'SKU-022': { sku: 'SKU-022', minThreshold: 22, reorderQty: 130, isAutoReorder: false },
  'SKU-025': { sku: 'SKU-025', minThreshold: 25, reorderQty: 150, isAutoReorder: true },
  'SKU-028': { sku: 'SKU-028', minThreshold: 28, reorderQty: 160, isAutoReorder: true },
  'SKU-030': { sku: 'SKU-030', minThreshold: 26, reorderQty: 155, isAutoReorder: true },
  'SKU-032': { sku: 'SKU-032', minThreshold: 24, reorderQty: 140, isAutoReorder: false },
  'SKU-035': { sku: 'SKU-035', minThreshold: 35, reorderQty: 200, isAutoReorder: true },
  'SKU-038': { sku: 'SKU-038', minThreshold: 20, reorderQty: 120, isAutoReorder: true },
  'SKU-040': { sku: 'SKU-040', minThreshold: 30, reorderQty: 180, isAutoReorder: true },
  'SKU-042': { sku: 'SKU-042', minThreshold: 25, reorderQty: 150, isAutoReorder: true },
  'SKU-045': { sku: 'SKU-045', minThreshold: 28, reorderQty: 165, isAutoReorder: true },
}

