import { Package, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type SKUInventoryEmptyStateProps = {
  type?: 'no-data' | 'no-results' | 'error'
  onRetry?: () => void
  onCreateNew?: () => void
}

export function SKUInventoryEmptyState({
  type = 'no-data',
  onRetry,
  onCreateNew,
}: SKUInventoryEmptyStateProps) {
  const config = {
    'no-data': {
      icon: Package,
      title: 'Chưa có SKU nào',
      description: 'Tạo SKU mới để bắt đầu quản lý tồn kho.',
      action: 'Tạo SKU mới',
      handler: onCreateNew,
    },
    'no-results': {
      icon: Search,
      title: 'Không tìm thấy SKU',
      description: 'Hãy thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem kết quả.',
      action: 'Làm mới',
      handler: onRetry,
    },
    'error': {
      icon: Package,
      title: 'Lỗi khi tải dữ liệu',
      description: 'Không thể tải danh sách SKU. Vui lòng thử lại sau.',
      action: 'Thử lại',
      handler: onRetry,
    },
  }

  const { icon: Icon, title, description, action, handler } = config[type]

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <Icon className="h-8 w-8 text-slate-400" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">{description}</p>

      {handler && (
        <Button
          onClick={handler}
          className="mt-4 gap-2"
          variant={type === 'error' ? 'outline' : 'default'}
        >
          {action}
        </Button>
      )}
    </div>
  )
}
