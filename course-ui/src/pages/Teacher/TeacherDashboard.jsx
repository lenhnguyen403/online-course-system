import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import EmptyState from '../../components/ui/EmptyState'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaChalkboardTeacher, FaUsers, FaBookOpen, FaTasks, FaCalendarAlt } from 'react-icons/fa'

export default function TeacherDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get('/dashboard/teacher').then((res) => setData(res.data)).catch(ToastMessage.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const classes = data?.classes || []

  return (
    <div className="space-y-8">
      <PageHeader breadcrumbs={[{ label: 'Tổng quan' }]} title="Tổng quan giảng viên" description="Số lớp đang dạy và danh sách lớp của bạn." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard icon={FaBookOpen} label="Số lớp đang dạy" value={data?.totalClasses ?? 0} variant="rose" />
        <StatCard icon={FaUsers} label="Tổng học viên" value={data?.totalStudents ?? 0} variant="rose" />
        <Link to="/teacher/pending-submissions" className="flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-rose-300 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <FaTasks className="text-xl" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{data?.pendingSubmissionsCount ?? 0}</p>
            <p className="text-sm text-slate-500">Bài nộp chờ chấm →</p>
          </div>
        </Link>
      </div>

      <div className="flex justify-end">
        <Link to="/teacher/calendar" className="inline-flex items-center gap-2 text-rose-600 font-medium hover:underline">
          <FaCalendarAlt /> Xem lịch dạy
        </Link>
      </div>

      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Lớp của tôi</h2>
        {classes.length === 0 ? (
          <div className="card">
            <EmptyState icon={FaChalkboardTeacher} title="Chưa có lớp nào" description="Bạn chưa được phân công lớp. Liên hệ admin hoặc giáo vụ." />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classes.slice(0, 6).map((c) => (
                <Link key={c._id} to={`/teacher/classes/${c._id}`} className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-rose-300 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-200 transition-colors">
                    <FaBookOpen className="text-xl" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 group-hover:text-rose-700">{c.className}</p>
                    <p className="text-sm text-slate-500">{c.classCode} · {c.courseId?.courseName || '-'}</p>
                  </div>
                </Link>
              ))}
            </div>
            {classes.length > 6 && (
              <Link to="/teacher/classes" className="inline-flex items-center gap-2 mt-4 text-rose-600 font-semibold hover:underline">Xem tất cả lớp →</Link>
            )}
          </>
        )}
      </section>
    </div>
  )
}
