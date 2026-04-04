import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationProps {
  currentPage: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
  compact?: boolean
}

export function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  compact = false,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxPagesToShow = 5
    const halfPages = Math.floor(maxPagesToShow / 2)

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - halfPages)
      let endPage = Math.min(totalPages - 1, currentPage + halfPages)

      // Adjust range if we're near the start or end
      if (currentPage <= halfPages + 1) {
        endPage = Math.min(totalPages - 1, maxPagesToShow - 1)
      } else if (currentPage >= totalPages - halfPages) {
        startPage = Math.max(2, totalPages - maxPagesToShow + 2)
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('...')
      }

      // Add page numbers
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const containerClass = compact
    ? 'flex items-center justify-end gap-4'
    : 'px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50'

  return (
    <div className={containerClass}>
      {!compact && (
        <div className="text-xs text-slate-600">
          Hiển thị <span className="font-medium">{startItem}</span>-<span className="font-medium">{endItem}</span> trong{' '}
          <span className="font-medium">{totalCount}</span> mục
        </div>
      )}

      <div className="text-xs text-slate-600 flex items-center gap-2">
        <span>Hiển thị</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="text-xs border border-slate-200 bg-white rounded px-2 py-1 font-medium text-slate-900 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>trên trang</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getPageNumbers().map((page, idx) => (
          <button
            key={`${page}-${idx}`}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-2 py-1 text-xs font-medium rounded ${
              page === currentPage
                ? 'bg-indigo-600 text-white'
                : page === '...'
                  ? 'cursor-default'
                  : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="p-1 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
