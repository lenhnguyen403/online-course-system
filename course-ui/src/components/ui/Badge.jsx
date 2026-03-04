/**
 * Badge for status display
 * variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
 */
const variants = {
  success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-100 text-amber-800 border-amber-200',
  danger: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
}

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant] || variants.neutral} ${className}`}
    >
      {children}
    </span>
  )
}
