import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ToastMessage from '../../messages/ToastMessage'
import Pagination from '../../components/ui/Pagination'
import { FaBell } from 'react-icons/fa'

export default function StudentNotifications() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    axiosClient.get('/me/notifications', { params: { page: page - 1, size: pageSize } })
      .then((res) => {
        setList(res.data.data || [])
        setTotal(res.data.total ?? 0)
        setUnreadCount(res.data.unreadCount ?? 0)
      })
      .catch(() => { setList([]); setTotal(0) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, pageSize])

  const markRead = (id) => {
    axiosClient.patch(`/me/notifications/${id}/read`)
      .then(() => load())
      .catch(ToastMessage.error)
  }

  const markAllRead = () => {
    axiosClient.patch('/me/notifications/read-all')
      .then(() => { load(); ToastMessage.success('Đã đánh dấu tất cả đã đọc') })
      .catch(ToastMessage.error)
  }

  const handlePageChange = (p) => { setPage(p) }
  const handlePageSizeChange = (s) => { setPageSize(s); setPage(1) }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { label: 'Thông báo' }]} title="Thông báo" description="Thông báo từ lớp học và bài tập." />
      <div className="card card-body">
        {unreadCount > 0 && (
          <div className="flex justify-end mb-4">
            <button type="button" onClick={markAllRead} className="btn-secondary text-sm">Đánh dấu tất cả đã đọc</button>
          </div>
        )}
        {list.length === 0 ? (
          <p className="py-8 text-center text-slate-500">Chưa có thông báo.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {list.map((n) => (
                <li key={n._id} className={`flex items-start gap-3 p-3 rounded-xl border ${n.read ? 'bg-slate-50/50 border-slate-100' : 'bg-cyan-50/30 border-cyan-100'}`}>
                  <FaBell className={`mt-0.5 shrink-0 ${n.read ? 'text-slate-400' : 'text-cyan-500'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800">{n.title}</p>
                    {n.body && <p className="text-sm text-slate-600 mt-0.5">{n.body}</p>}
                    <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString('vi')}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {!n.read && <button type="button" onClick={() => markRead(n._id)} className="text-cyan-600 text-sm hover:underline">Đã đọc</button>}
                    {n.link && <Link to={n.link} className="text-cyan-600 text-sm hover:underline">Xem</Link>}
                  </div>
                </li>
              ))}
            </ul>
            <Pagination page={page} total={total} pageSize={pageSize} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} />
          </>
        )}
      </div>
    </div>
  )
}
