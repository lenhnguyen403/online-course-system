import { Link } from 'react-router-dom'

/**
 * PageHeader: breadcrumb + title + optional description/actions
 * items: [{ to?, label }] — last item is current page (no link)
 */
export default function PageHeader({ breadcrumbs = [], title, description, action }) {
  return (
    <header className="mb-8">
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-2" aria-label="Breadcrumb">
          {breadcrumbs.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-slate-300">/</span>}
              {item.to ? (
                <Link to={item.to} className="hover:text-slate-700 transition-colors">{item.label}</Link>
              ) : (
                <span className="text-slate-800 font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-slate-600 text-sm">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  )
}
