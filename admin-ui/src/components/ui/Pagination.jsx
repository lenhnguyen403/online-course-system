import { useMemo } from 'react'

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

/**
 * Pagination component. Uses 1-based page index for display.
 * Backend expects page (0-based) and size.
 */
export default function Pagination({
  page,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  className = '',
}) {
  const totalPages = useMemo(() => (pageSize > 0 ? Math.ceil(total / pageSize) : 0), [total, pageSize])
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const hasPrev = page > 1
  const hasNext = page < totalPages

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = []
    if (page <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    } else if (page >= totalPages - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = page - 1; i <= page + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }, [page, totalPages])

  if (total === 0 && page === 1) return null

  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 py-4 ${className}`}>
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <span>
          Hiển thị <span className="font-medium text-slate-800">{total === 0 ? 0 : start}</span>
          {' – '}
          <span className="font-medium text-slate-800">{end}</span>
          {' của '}
          <span className="font-medium text-slate-800">{total}</span>
        </span>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>{s}/trang</option>
            ))}
          </select>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        {pageNumbers.map((n, i) =>
          n === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-slate-400">…</span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              className={`min-w-[2.25rem] rounded-lg border px-2 py-1.5 text-sm font-medium ${
                n === page
                  ? 'border-orange-500 bg-orange-500 text-white'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {n}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
    </div>
  )
}
