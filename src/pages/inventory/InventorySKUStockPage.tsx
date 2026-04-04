import { useState } from 'react'
import { InventoryPageHeaderView } from '@/features/inventory/components/inventory-page-header/InventoryPageHeaderView'
import { InventoryAlertBannerView } from '@/features/inventory/components/inventory-alert-banner/InventoryAlertBannerView'
import { InventoryFilterBarView } from '@/features/inventory/components/inventory-filter/InventoryFilterBarView'
import { InventoryTableView } from '@/features/inventory/components/inventory-table/InventoryTableView'
import { InventoryGridView } from '@/features/inventory/components/inventory-grid/InventoryGridView'
import { useInventoryAlerts } from '@/features/inventory/hooks/useInventoryData'
import type { ViewMode } from '@/features/inventory/logic/inventoryPageHeader.types'

interface Filters {
  search: string
  category: string
  platform: string
  status: string
}

export function InventorySKUStockPage() {
  const [showAlert, setShowAlert] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [filters, setFilters] = useState<Filters>({
    search: '',
    category: '',
    platform: '',
    status: '',
  })

  // Fetch alerts from API
  const { data: alertsData } = useInventoryAlerts({
    severity: filters.status || undefined,
  })

  // Count alerts with severity = 'Critical' or 'Warning' (low stock)
  const lowStockAlerts = alertsData?.items?.filter(
    (a) => a.severity === 'Warning' || a.severity === 'Critical'
  ) || []

  const lowStockAlert = showAlert && lowStockAlerts.length > 0
    ? {
        count: lowStockAlerts.length,
        onViewAlerts: () => console.log('View alerts'),
        onClose: () => setShowAlert(false),
      }
    : null

  const handleFilterChange = (updates: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div className="space-y-6">
      <InventoryPageHeaderView selectedViewMode={viewMode} onViewModeChange={setViewMode} />
      <InventoryAlertBannerView 
        alert={lowStockAlert}
        onViewAlerts={() => console.log('View alerts')}
      />
      
      {/* Filter Bar */}
      <InventoryFilterBarView 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      {viewMode === 'table' ? (
        <InventoryTableView
          filters={{
            search: filters.search,
            status: filters.status,
            category: filters.category,
            platform: filters.platform,
          }}
        />
      ) : (
        <InventoryGridView 
          filters={{
            search: filters.search,
            status: filters.status,
            category: filters.category,
            platform: filters.platform,
          }}
        />
      )}
    </div>
  )
}



