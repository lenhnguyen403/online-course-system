import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaCalendarAlt, FaTasks, FaClipboardList } from 'react-icons/fa'

export default function StudentCalendar() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  useEffect(() => {
    const start = new Date(month.year, month.month, 1)
    const end = new Date(month.year, month.month + 1, 0, 23, 59, 59)
    axiosClient.get('/me/calendar', { params: { start: start.toISOString(), end: end.toISOString() } })
      .then((res) => setEvents(res.data.events || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [month.year, month.month])

  const prevMonth = () => {
    setMonth((m) => (m.month === 0 ? { year: m.year - 1, month: 11 } : { year: m.year, month: m.month - 1 }))
  }
  const nextMonth = () => {
    setMonth((m) => (m.month === 11 ? { year: m.year + 1, month: 0 } : { year: m.year, month: m.month + 1 }))
  }
  const monthLabel = new Date(month.year, month.month).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { label: 'Lịch' }]} title="Lịch học" description="Bài tập sắp hạn và lịch thi trong tháng." />

      <div className="card card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <FaCalendarAlt className="text-cyan-500" />
            {monthLabel}
          </h2>
          <div className="flex gap-2">
            <button type="button" onClick={prevMonth} className="btn-secondary text-sm">Tháng trước</button>
            <button type="button" onClick={nextMonth} className="btn-secondary text-sm">Tháng sau</button>
          </div>
        </div>

        {events.length === 0 ? (
          <p className="text-slate-500 py-6">Không có sự kiện nào trong tháng này.</p>
        ) : (
          <ul className="space-y-3">
            {events.map((ev) => (
              <li key={`${ev.type}-${ev.id}`} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
                <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center ${ev.type === 'assignment' ? 'bg-amber-100 text-amber-600' : 'bg-violet-100 text-violet-600'}`}>
                  {ev.type === 'assignment' ? <FaTasks className="text-lg" /> : <FaClipboardList className="text-lg" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-800">{ev.title}</p>
                  <p className="text-sm text-slate-500">{ev.className} · {new Date(ev.date).toLocaleString('vi-VN')}</p>
                </div>
                {ev.type === 'assignment' && ev.classId && (
                  <Link to={`/student/assignments`} className="btn-secondary text-sm shrink-0">Xem bài tập</Link>
                )}
                {ev.type === 'exam' && ev.examId && (
                  <Link to="/student/exams" className="btn-secondary text-sm shrink-0">Xem điểm thi</Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
