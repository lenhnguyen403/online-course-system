import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaBullhorn } from 'react-icons/fa'

export default function StudentAnnouncements() {
  const [data, setData] = useState({ data: [], total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get('/me/announcements', { params: { limit: 50 } })
      .then((res) => setData({ data: res.data.data || [], total: res.data.total ?? 0 }))
      .catch(() => setData({ data: [], total: 0 }))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { label: 'Thông báo' }]} title="Thông báo" description="Tất cả thông báo từ các lớp của bạn." />

      <div className="card card-body">
        {data.data.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <FaBullhorn className="mx-auto text-4xl text-slate-300 mb-3" />
            <p>Chưa có thông báo nào.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {data.data.map((a) => (
              <li key={a._id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-start gap-2">
                  {a.pinned && <span className="text-xs font-medium text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded">Ghim</span>}
                  <h3 className="font-bold text-slate-800">{a.title}</h3>
                </div>
                <p className="text-sm text-slate-500 mt-1">{a.classId?.className} · {a.authorId?.fullName} · {new Date(a.createdAt).toLocaleString('vi')}</p>
                {a.content && <p className="mt-2 text-slate-700 whitespace-pre-wrap">{a.content}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
