/**
 * StatCard: icon + label + value + optional sub (e.g. unit)
 * variant: 'default' | 'cyan' | 'rose' | 'orange' | 'emerald'
 */
const variantStyles = {
  default: 'bg-slate-50 border-slate-200 text-slate-800',
  cyan: 'bg-cyan-50 border-cyan-200 text-cyan-800',
  rose: 'bg-rose-50 border-rose-200 text-rose-800',
  orange: 'bg-orange-50 border-orange-200 text-orange-800',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-800',
}

const iconBg = {
  default: 'bg-slate-100 text-slate-600',
  cyan: 'bg-cyan-100 text-cyan-600',
  rose: 'bg-rose-100 text-rose-600',
  orange: 'bg-orange-100 text-orange-600',
  emerald: 'bg-emerald-100 text-emerald-600',
}

export default function StatCard({ icon: Icon, label, value, sub, variant = 'default' }) {
  return (
    <div className={`rounded-xl border p-5 transition-shadow hover:shadow-md ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value ?? '—'}</p>
          {sub != null && sub !== '' && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
        </div>
        {Icon && (
          <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${iconBg[variant]}`}>
            <Icon className="text-xl" />
          </div>
        )}
      </div>
    </div>
  )
}
