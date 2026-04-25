import { Fragment, type ReactNode, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type DataTableSortDirection = 'asc' | 'desc'

export type DataTableSortState = {
  columnId: string
  direction: DataTableSortDirection
}

export type DataTableColumn<T> = {
  id: string
  header: ReactNode
  sortable?: boolean
  accessor?: keyof T | ((row: T) => unknown)
  sortAccessor?: (row: T) => unknown
  cell?: (row: T, index: number) => ReactNode
  widthClassName?: string
  headerClassName?: string
  cellClassName?: string | ((row: T) => string)
  align?: 'left' | 'center' | 'right'
}

type DataTableProps<T> = {
  rows: T[]
  columns: DataTableColumn<T>[]
  rowKey: (row: T, index: number) => string
  emptyText?: string
  emptyColSpan?: number
  tableClassName?: string
  bodyClassName?: string
  rowClassName?: string | ((row: T) => string)
  onRowClick?: (row: T) => void
  renderAfterRow?: (row: T, index: number) => ReactNode
  disableScroll?: boolean
  initialSort?: DataTableSortState
  sortState?: DataTableSortState
  onSortChange?: (state: DataTableSortState) => void
}

function resolveCellValue<T>(row: T, column: DataTableColumn<T>): unknown {
  if (typeof column.accessor === 'function') {
    return column.accessor(row)
  }

  if (column.accessor) {
    return row[column.accessor]
  }

  return null
}

function resolveSortValue<T>(row: T, column: DataTableColumn<T>): unknown {
  if (column.sortAccessor) {
    return column.sortAccessor(row)
  }

  return resolveCellValue(row, column)
}

function compareUnknown(a: unknown, b: unknown): number {
  const normalize = (value: unknown): number | string => {
    if (value instanceof Date) {
      return value.getTime()
    }

    if (typeof value === 'number') {
      return value
    }

    if (typeof value === 'boolean') {
      return value ? 1 : 0
    }

    if (typeof value === 'string') {
      return value
    }

    if (value == null) {
      return ''
    }

    return String(value)
  }

  const left = normalize(a)
  const right = normalize(b)

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right
  }

  return String(left).localeCompare(String(right), 'vi')
}

function getSortIcon(isActive: boolean, direction: DataTableSortDirection) {
  if (!isActive) return <ArrowUpDown className="size-3.5 text-slate-400" />
  if (direction === 'asc') return <ArrowUp className="size-3.5 text-indigo-600" />
  return <ArrowDown className="size-3.5 text-indigo-600" />
}

export function DataTable<T>({
  rows,
  columns,
  rowKey,
  emptyText = 'Không có dữ liệu.',
  emptyColSpan,
  tableClassName,
  bodyClassName,
  rowClassName,
  onRowClick,
  renderAfterRow,
  disableScroll = false,
  initialSort,
  sortState,
  onSortChange,
}: DataTableProps<T>) {
  const [internalSort, setInternalSort] = useState<DataTableSortState | undefined>(initialSort)
  const activeSort = sortState ?? internalSort

  const sortedRows = useMemo(() => {
    if (!activeSort) {
      return rows
    }

    const sortColumn = columns.find((column) => column.id === activeSort.columnId && column.sortable)
    if (!sortColumn) {
      return rows
    }

    const sorted = [...rows]
    sorted.sort((first, second) => {
      const firstValue = resolveSortValue(first, sortColumn)
      const secondValue = resolveSortValue(second, sortColumn)
      const baseResult = compareUnknown(firstValue, secondValue)
      return activeSort.direction === 'asc' ? baseResult : -baseResult
    })

    return sorted
  }, [activeSort, columns, rows])

  const updateSort = (columnId: string) => {
    const nextState: DataTableSortState =
      activeSort?.columnId === columnId
        ? {
            columnId,
            direction: activeSort.direction === 'asc' ? 'desc' : 'asc',
          }
        : {
            columnId,
            direction: 'desc',
          }

    if (!sortState) {
      setInternalSort(nextState)
    }

    onSortChange?.(nextState)
  }

  const renderCell = (row: T, column: DataTableColumn<T>, index: number) => {
    if (column.cell) {
      return column.cell(row, index)
    }

    return String(resolveCellValue(row, column) ?? '')
  }

  const alignClassMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <Table disableScroll={disableScroll} className={cn(tableClassName, "relative")}>
      <TableHeader className="sticky top-0 z-40">
        <TableRow className="h-11 border-b border-slate-100 bg-slate-50/90 hover:bg-slate-50/90">
          {columns.map((column) => {
            const alignClass = alignClassMap[column.align ?? 'left']
            const isSortActive = activeSort?.columnId === column.id

            return (
              <TableHead
                key={column.id}
                className={cn(
                  'text-[11px] font-black tracking-widest text-slate-500 uppercase',
                  alignClass,
                  column.widthClassName,
                  column.headerClassName,
                )}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    className={cn('inline-flex items-center gap-2 uppercase font-black', column.align === 'right' ? 'ml-auto' : '')}
                    onClick={() => updateSort(column.id)}
                  >
                    <span className="uppercase">{column.header}</span>
                    {getSortIcon(isSortActive, activeSort?.direction ?? 'desc')}
                  </button>
                ) : (
                  <span className="uppercase">{column.header}</span>
                )}
              </TableHead>
            )
          })}
        </TableRow>
      </TableHeader>

      <TableBody className={bodyClassName}>
        {sortedRows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={emptyColSpan ?? columns.length} className="py-10 text-center text-sm text-slate-500">
              {emptyText}
            </TableCell>
          </TableRow>
        ) : (
          sortedRows.map((row, index) => {
            const rowClass = typeof rowClassName === 'function' ? rowClassName(row) : rowClassName
            return (
              <Fragment key={rowKey(row, index)}>
                <TableRow
                  className={cn('min-h-[72px] border-b border-slate-100 bg-white transition-colors hover:bg-slate-50/90', rowClass, onRowClick ? 'cursor-pointer' : '')}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => {
                    const cellClass = typeof column.cellClassName === 'function' ? column.cellClassName(row) : column.cellClassName
                    const alignClass = alignClassMap[column.align ?? 'left']

                    return (
                      <TableCell key={column.id} className={cn('py-3', alignClass, cellClass)}>
                        {renderCell(row, column, index)}
                      </TableCell>
                    )
                  })}
                </TableRow>
                {renderAfterRow ? renderAfterRow(row, index) : null}
              </Fragment>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
