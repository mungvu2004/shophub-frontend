import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useInventoryAlerts, useInventorySKUs } from '@/features/inventory/hooks/useInventoryData'
import { inventoryService } from '@/features/inventory/services/inventoryService'
import type { ViewMode } from '@/features/inventory/logic/inventoryPageHeader.types'
import { useBulkImport } from '@/features/inventory/hooks/useBulkImport'
import { toast } from 'sonner'
import { useInventorySKUStockActions } from './useInventorySKUStockActions'
import type { StockLevel } from '@/types/inventory.types'

export interface InventorySKUStockPageFilters {
  search: string
  category?: string[]
  platform?: string[]
  status?: string[]
}

export function useInventorySKUStockPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const bulkImport = useBulkImport()
  const [showAlert, setShowAlert] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [filters, setFilters] = useState<InventorySKUStockPageFilters>({
    search: '',
    category: undefined,
    platform: undefined,
    status: undefined,
  })

  // Modal State cho SKU Form
  const [isSKUFormOpen, setIsSKUFormOpen] = useState(false)
  const [skuToEdit, setSkuToEdit] = useState<StockLevel | null>(null)

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['inventory', 'skus'] })
    queryClient.invalidateQueries({ queryKey: ['inventory', 'summary'] })
  }, [queryClient])

  const skuActions = useInventorySKUStockActions(refreshData)

  // Lấy danh mục động từ API
  const { data: categoryOptions = [] } = useQuery({
    queryKey: ['inventory', 'categories'],
    queryFn: () => inventoryService.getCategories(),
  })

  // Lấy dữ liệu cảnh báo
  const { data: alertsData } = useInventoryAlerts({
    severity: filters.status?.join(','),
  })

  // Dữ liệu dùng để export
  const { data: exportSource } = useInventorySKUs({
    search: filters.search || undefined,
    status: filters.status?.join(','),
    category: filters.category?.join(','),
    platform: filters.platform?.join(','),
    limit: 1000,
    offset: 0,
  })

  // Logic xử lý cảnh báo tồn kho thấp
  const lowStockAlerts = useMemo(() => {
    return alertsData?.items?.filter((a) => a.severity === 'Warning' || a.severity === 'Critical') || []
  }, [alertsData])

  const lowStockAlert = useMemo(() => {
    return showAlert && lowStockAlerts.length > 0
      ? {
          count: lowStockAlerts.length,
          onViewAlerts: () => console.log('Xem cảnh báo'),
          onClose: () => setShowAlert(false),
        }
      : null
  }, [showAlert, lowStockAlerts])

  const handleFilterChange = (updates: Partial<InventorySKUStockPageFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
  }

  const handleAdjustStock = () => {
    navigate('/inventory/adjust', {
      state: { from: '/inventory/sku-stock' },
    })
  }

  const handleExportData = () => {
    const items = exportSource?.items ?? []
    if (items.length === 0) {
      toast.warning('Không có dữ liệu tồn kho để xuất.')
      return
    }

    const csvHeader = ['SKU', 'Tên sản phẩm', 'Danh mục', 'Tồn thực tế', 'Tồn khả dụng']
    const csvRows = items.map((item) => [
      item.sku,
      item.productName || item.variantName || '',
      item.category || '',
      String(item.physicalQty || 0),
      String(item.availableQty || 0),
    ])

    const csv = [csvHeader, ...csvRows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `inventory-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success(`Đã xuất ${items.length} dòng dữ liệu.`)
  }

  const handleImportData = () => {
    bulkImport.openModal()
  }

  const handleAddSKU = () => {
    setSkuToEdit(null)
    setIsSKUFormOpen(true)
  }

  const handleEditSKU = (sku: StockLevel) => {
    setSkuToEdit(sku)
    setIsSKUFormOpen(true)
  }

  const handleSubmitSKU = async (data: Partial<StockLevel>) => {
    if (skuToEdit) {
      await skuActions.handleUpdate(skuToEdit.id, data)
    } else {
      await skuActions.handleCreate(data)
    }
    setIsSKUFormOpen(false)
  }

  // Lấy dữ liệu tổng quan kho
  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['inventory', 'summary'],
    queryFn: () => inventoryService.getInventorySummary(),
    staleTime: 5 * 60 * 1000,
  })

  const totalSKUs = summaryData?.totalSKUs ?? 0
  const lowStockCount = summaryData?.lowStockCount ?? 0
  const totalValue = summaryData?.totalValue ?? '₫ 0'
  const lastUpdated = summaryData?.lastUpdated ?? '--:--'

  return {
    viewMode,
    filters,
    showAlert,
    lowStockAlert,
    bulkImport,
    totalSKUs,
    lowStockCount,
    totalValue,
    lastUpdated,
    categoryOptions,
    isLoading: isSummaryLoading,
    skuActions,
    skuForm: {
      isOpen: isSKUFormOpen,
      onClose: () => setIsSKUFormOpen(false),
      initialData: skuToEdit,
      onSubmit: handleSubmitSKU,
      isProcessing: skuActions.isProcessing && (skuActions.actionType === 'creating' || skuActions.actionType === 'updating'),
    },
    handleFilterChange,
    handleViewModeChange,
    handleAdjustStock,
    handleExportData,
    handleImportData,
    handleAddSKU,
    handleEditSKU,
  }
}
