import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function StaffPermissionsBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm">
      <Link to="/settings" className="text-slate-400 transition-colors hover:text-slate-600">
        Cài đặt
      </Link>
      <ChevronRight className="size-4 text-slate-300" />
      <span className="font-semibold text-indigo-600">Phân quyền Nhân viên</span>
    </nav>
  )
}