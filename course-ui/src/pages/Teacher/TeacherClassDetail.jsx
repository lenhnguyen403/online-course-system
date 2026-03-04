import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaPenFancy, FaUsers, FaFilter } from 'react-icons/fa'

const STATUS_LABEL = { active: 'Đang học', suspended: 'Đình chỉ', 'transfer pending': 'Chờ chuyển lớp', dropped: 'Thôi học' }
const STATUS_BADGE = { active: 'success', suspended: 'warning', 'transfer pending': 'info', dropped: 'danger' }

export default function TeacherClassDetail() {
  const { classId } = useParams()
  const [classInfo, setClassInfo] = useState(null)
  const [students, setStudents] = useState([])
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [journalContent, setJournalContent] = useState('')
  const [loading, setLoading] = useState(true)

  const loadClass = () => {
    axiosClient.get(`/classes/${classId}`).then((res) => setClassInfo(res.data)).catch(ToastMessage.error)
  }
  const loadStudents = () => {
    const params = statusFilter ? { status: statusFilter, limit: 100 } : { limit: 100 }
    axiosClient.get(`/classes/${classId}/students`, { params })
      .then((res) => { setStudents(res.data.data || []); setTotal(res.data.total ?? 0) })
      .catch(ToastMessage.error)
  }
  useEffect(() => { loadClass() }, [classId])
  useEffect(() => { if (classId) loadStudents() }, [classId, statusFilter])
  useEffect(() => { setLoading(false) }, [classInfo])

  const handleSubmitJournal = (e) => {
    e.preventDefault()
    if (!journalContent.trim()) return
    axiosClient.post(`/journals/classes/${classId}/journals`, { content: journalContent })
      .then(() => { ToastMessage.success('Đã lưu nhật ký lớp'); setJournalContent('') })
      .catch(ToastMessage.error)
  }

  if (!classInfo) return <LoadingSpinner />

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[{ to: '/teacher', label: 'Tổng quan' }, { to: '/teacher/classes', label: 'Lớp của tôi' }, { label: classInfo.className }]}
        title={classInfo.className}
        description={classInfo.classCode && (classInfo.courseId?.courseName ? `${classInfo.classCode} · ${classInfo.courseId.courseName}` : classInfo.classCode)}
      />

      <section className="card">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <FaPenFancy className="text-lg" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Nhật ký lớp (hằng ngày)</h2>
              <p className="text-sm text-slate-500">Ngày và tên giảng viên được lưu tự động</p>
            </div>
          </div>
          <form onSubmit={handleSubmitJournal} className="flex flex-col sm:flex-row gap-3">
            <textarea value={journalContent} onChange={(e) => setJournalContent(e.target.value)} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 min-h-[80px]" rows={2} placeholder="Nội dung nhật ký..." required />
            <button type="submit" className="shrink-0 px-5 py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition-colors">Ghi nhật ký</button>
          </form>
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                <FaUsers className="text-lg" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Danh sách học viên</h2>
                <p className="text-sm text-slate-500">Tổng: {total} học viên</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-slate-400 text-sm" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="">Tất cả trạng thái</option>
                {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Họ tên</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">SĐT</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Trạng thái</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {students.map((en) => (
                  <tr key={en._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800">{en.studentId?.fullName}</td>
                    <td className="py-3 px-4 text-slate-600">{en.studentId?.email}</td>
                    <td className="py-3 px-4 text-slate-600">{en.studentId?.phoneNumber}</td>
                    <td className="py-3 px-4"><Badge variant={STATUS_BADGE[en.status] || 'neutral'}>{STATUS_LABEL[en.status] || en.status}</Badge></td>
                    <td className="py-3 px-4 text-right">
                      <Link to={`/teacher/classes/${classId}/students/${en.studentId?._id}`} className="text-rose-600 font-medium hover:underline">Chi tiết / Nhật ký HV</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
