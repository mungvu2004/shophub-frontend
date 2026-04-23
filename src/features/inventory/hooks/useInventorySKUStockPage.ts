import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInventoryAlerts, useInventorySKUs } from '@/features/inventory/hooks/useInventoryData'
import type { ViewMode } from '@/features/inventory/logic/inventoryPageHeader.types'
import { toast } from 'sonner'

export interface InventorySKUStockPageFilters {
  search: string
  category: string
  platform: string
  status: string
}

export function useInventorySKUStockPage() {
  const navigate = useNavigate()
  const [showAlert, setShowAlert] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [filters, setFilters] = useState<InventorySKUStockPageFilters>({
    search: '',
    category: '',
    platform: '',
    status: '',
  })

  const { data: alertsData } = useInventoryAlerts({
    severity: filters.status || undefined,
  })

  const { data: exportSource } = useInventorySKUs({
    search: filters.search || undefined,
    status: filters.status || undefined,
    category: filters.category || undefined,
    platform: filters.platform || undefined,
    limit: 1000,
    offset: 0,
  })

  const lowStockAlerts = useMemo(() => {
    return alertsData?.items?.filter((a) => a.severity === 'Warning' || a.severity === 'Critical') || []
  }, [alertsData])

  const lowStockAlert = useMemo(() => {
    return showAlert && lowStockAlerts.length > 0
      ? {
          count: lowStockAlerts.length,
          onViewAlerts: () => console.log('View alerts'),
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
      state: {
        from: '/inventory/sku-stock',
      },
    })
  }

  const handleExportData = () => {
    const items = exportSource?.items ?? []
    if (items.length === 0) {
      toast.warning('Không có dữ liệu tồn kho để xuất.')
      return
    }

    const csvHeader = ['SKU', 'Tên sản phẩm', 'Danh mục', 'Tồn thực tế', 'Tồn khả dụng', 'Shopee', 'TikTok', 'Lazada']
    const csvRows = items.map((item) => [
      item.sku,
      item.productName || item.variantName || '',
      item.category || '',
      String(item.physicalQty || 0),
      String(item.availableQty || 0),
      String(item.channelStock?.shopee || 0),
      String(item.channelStock?.tiktok || 0),
      String(item.channelStock?.lazada || 0),
    ])

    const csv = [csvHeader, ...csvRows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const stamp = new Date().toISOString().slice(0, 10)
    link.href = url
    link.download = `inventory-${stamp}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success(`Đã xuất ${items.length} dòng dữ liệu tồn kho.`)
  }

  const handleImportData = () => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.csv'
    fileInput.onchange = () => {
      const selectedFile = fileInput.files?.[0]
      if (!selectedFile) {
        toast.warning('Bạn chưa chọn file import.')
        return
      }
      toast.success(`Đã nhận file ${selectedFile.name}. Sẵn sàng xử lý nhập kho.`)
    }
    fileInput.click()
  }

  return {
    viewMode,
    filters,
    showAlert,
    lowStockAlert,
    handleFilterChange,
    handleViewModeChange,
    handleAdjustStock,
    handleExportData,
    handleImportData,
  }
}
