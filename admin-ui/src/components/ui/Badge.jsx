const variants = { success: 'bg-emerald-100 text-emerald-800', warning: 'bg-amber-100 text-amber-800', danger: 'bg-red-100 text-red-800', info: 'bg-cyan-100 text-cyan-800', neutral: 'bg-slate-100 text-slate-700' }
export default function Badge({ children, variant = 'neutral', className = '' }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.neutral} ${className}`}>{children}</span>
}
