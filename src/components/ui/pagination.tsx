import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

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
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false)
  const pageSizeDropdownRef = useRef<HTMLDivElement | null>(null)
  const pageSizeButtonRef = useRef<HTMLButtonElement | null>(null)
  const pageSizeMenuRef = useRef<HTMLDivElement | null>(null)
  const [pageSizeMenuPosition, setPageSizeMenuPosition] = useState({ top: 0, left: 0, width: 120 })

  const updatePageSizeMenuPosition = () => {
    if (!pageSizeButtonRef.current) {
      return
    }

    const rect = pageSizeButtonRef.current.getBoundingClientRect()
    const menuWidth = Math.max(120, Math.round(rect.width))
    const left = Math.min(window.innerWidth - menuWidth - 8, Math.max(8, rect.right - menuWidth))

    setPageSizeMenuPosition({
      top: Math.round(rect.bottom + 8),
      left: Math.round(left),
      width: menuWidth,
    })
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node

      if (pageSizeDropdownRef.current?.contains(target) || pageSizeMenuRef.current?.contains(target)) {
        return
      }

      setIsPageSizeOpen(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPageSizeOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    if (!isPageSizeOpen) {
      return
    }

    updatePageSizeMenuPosition()

    const handlePositionUpdate = () => {
      updatePageSizeMenuPosition()
    }

    window.addEventListener('resize', handlePositionUpdate)
    window.addEventListener('scroll', handlePositionUpdate, true)

    return () => {
      window.removeEventListener('resize', handlePositionUpdate)
      window.removeEventListener('scroll', handlePositionUpdate, true)
    }
  }, [isPageSizeOpen])

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

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-500">Hiển thị</span>

        <div className="relative z-40" ref={pageSizeDropdownRef}>
          <button
            ref={pageSizeButtonRef}
            type="button"
            onClick={() => setIsPageSizeOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition-colors hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            aria-haspopup="listbox"
            aria-expanded={isPageSizeOpen}
            aria-label="Chọn số lượng mục trên mỗi trang"
          >
            <span>{pageSize} mục</span>
            <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform ${isPageSizeOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {isPageSizeOpen &&
          createPortal(
            <div
              ref={pageSizeMenuRef}
              className="fixed z-[9999] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
              style={{
                top: pageSizeMenuPosition.top,
                left: pageSizeMenuPosition.left,
                width: pageSizeMenuPosition.width,
              }}
            >
              <ul role="listbox" aria-label="Danh sách số lượng mục" className="space-y-1">
                {pageSizeOptions.map((size) => {
                  const isSelected = size === pageSize

                  return (
                    <li key={size}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onPageSizeChange(size)
                          setIsPageSizeOpen(false)
                        }}
                        className={`w-full rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {size} mục
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>,
            document.body,
          )}


        <span className="text-xs font-medium text-slate-500">trên trang</span>
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
