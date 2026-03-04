import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaBookOpen, FaChalkboardTeacher } from 'react-icons/fa'

export default function StudentClasses() {
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get('/me/classes', { params: { limit: 50 } })
      .then((res) => setEnrollments(res.data.data || []))
      .catch(() => {
        axiosClient.get('/dashboard/student').then((res) => setEnrollments(res.data.enrollments || [])).catch(ToastMessage.error)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const list = Array.isArray(enrollments) ? enrollments : []

  return (
    <div className="space-y-8">
      <PageHeader breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { label: 'Lớp của tôi' }]} title="Lớp học của tôi" description="Danh sách các lớp bạn đã đăng ký." />

      {list.length === 0 ? (
        <div className="card">
          <EmptyState icon={FaBookOpen} title="Chưa có lớp nào" description="Bạn chưa đăng ký lớp học. Liên hệ giáo vụ hoặc trung tâm để được xếp lớp." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {list.map((c) => (
            <div key={c._id} className="group rounded-xl border border-slate-200 bg-white p-6 hover:border-cyan-300 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                  <FaBookOpen className="text-xl" />
                </div>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{c.classCode || '—'}</span>
              </div>
              <h3 className="mt-4 font-bold text-slate-800 text-lg">{c.className || 'Lớp học'}</h3>
              <p className="mt-1 text-sm text-slate-500">{c.courseId?.courseName || 'Khóa học'}</p>
              {c.teacherName && (
                <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <FaChalkboardTeacher className="text-slate-400" /> {c.teacherName}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
