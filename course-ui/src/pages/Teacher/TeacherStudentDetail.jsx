import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaMapMarkerAlt, FaPenFancy } from 'react-icons/fa'

const STATUS_LABEL = { active: 'Đang học', suspended: 'Đình chỉ', 'transfer pending': 'Chờ chuyển lớp', dropped: 'Thôi học' }
const STATUS_BADGE = { active: 'success', suspended: 'warning', 'transfer pending': 'info', dropped: 'danger' }

export default function TeacherStudentDetail() {
    const { classId, studentId } = useParams()
    const [enrollment, setEnrollment] = useState(null)
    const [journalContent, setJournalContent] = useState('')
    const [journals, setJournals] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient.get(`/classes/${classId}/students/${studentId}`)
            .then((res) => setEnrollment(res.data))
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }, [classId, studentId])

    useEffect(() => {
        if (studentId) {
            axiosClient.get(`/journals/students/${studentId}/journals`, { params: { limit: 20 } })
                .then((res) => setJournals(res.data.data || []))
                .catch(() => {})
        }
    }, [studentId])

    const handleSubmitJournal = (e) => {
        e.preventDefault()
        if (!journalContent.trim()) return
        axiosClient.post(`/journals/students/${studentId}/journals`, { content: journalContent })
            .then(() => {
                ToastMessage.success('Đã lưu nhật ký học viên')
                setJournalContent('')
                return axiosClient.get(`/journals/students/${studentId}/journals`, { params: { limit: 20 } })
            })
            .then((res) => setJournals(res.data.data || []))
            .catch(ToastMessage.error)
    }

  if (loading || !enrollment) return <LoadingSpinner />

  const s = enrollment.studentId

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[{ to: '/teacher', label: 'Tổng quan' }, { to: '/teacher/classes', label: 'Lớp của tôi' }, { to: `/teacher/classes/${classId}`, label: 'Lớp' }, { label: s?.fullName || 'HV' }]}
        title="Chi tiết học viên"
        description="Thông tin và nhật ký học viên trong lớp."
      />

      <div className="card overflow-hidden">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <FaUser className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{s?.fullName}</h2>
              <p className="text-slate-500">{s?.email}</p>
              <div className="mt-2"><Badge variant={STATUS_BADGE[enrollment.status] || 'neutral'}>{STATUS_LABEL[enrollment.status] || enrollment.status}</Badge></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex gap-3 p-3 rounded-xl bg-slate-50">
              <FaUser className="text-slate-400 mt-0.5 shrink-0" />
              <div><p className="text-slate-500">Mã HV</p><p className="font-medium text-slate-800">{s?._id || '—'}</p></div>
            </div>
            <div className="flex gap-3 p-3 rounded-xl bg-slate-50">
              <FaBirthdayCake className="text-slate-400 mt-0.5 shrink-0" />
              <div><p className="text-slate-500">Ngày sinh</p><p className="font-medium text-slate-800">{s?.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString('vi-VN') : '—'}</p></div>
            </div>
            <div className="flex gap-3 p-3 rounded-xl bg-slate-50 sm:col-span-2">
              <FaMapMarkerAlt className="text-slate-400 mt-0.5 shrink-0" />
              <div><p className="text-slate-500">Địa chỉ</p><p className="font-medium text-slate-800">{s?.address || '—'}</p></div>
            </div>
            <div className="flex gap-3 p-3 rounded-xl bg-slate-50">
              <FaPhone className="text-slate-400 mt-0.5 shrink-0" />
              <div><p className="text-slate-500">SĐT</p><p className="font-medium text-slate-800">{s?.phoneNumber || '—'}</p></div>
            </div>
          </div>
        </div>
      </div>

      <section className="card">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <FaPenFancy className="text-lg" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Nhật ký học viên</h2>
              <p className="text-sm text-slate-500">Ngày và tên giảng viên được lưu tự động</p>
            </div>
          </div>
          <form onSubmit={handleSubmitJournal} className="flex flex-col sm:flex-row gap-3 mb-6">
            <textarea value={journalContent} onChange={(e) => setJournalContent(e.target.value)} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 min-h-[80px]" rows={2} placeholder="Nội dung nhật ký..." required />
            <button type="submit" className="shrink-0 px-5 py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600">Ghi nhật ký</button>
          </form>
          <p className="text-sm font-medium text-slate-600 mb-3">Lịch sử nhật ký</p>
          <ul className="space-y-3">
            {journals.map((j) => (
              <li key={j._id} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500 shrink-0">{new Date(j.createdAt).toLocaleString('vi-VN')}</span>
                <span className="text-slate-800">{j.content}</span>
              </li>
            ))}
            {journals.length === 0 && <li className="text-slate-400 py-4 text-center text-sm">Chưa có nhật ký.</li>}
          </ul>
        </div>
      </section>
    </div>
  )
}
