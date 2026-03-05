import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Pagination from '../../components/ui/Pagination'
import { FaPenFancy, FaUsers, FaFilter, FaTasks, FaBullhorn, FaComments } from 'react-icons/fa'

const STATUS_LABEL = { active: 'Đang học', suspended: 'Đình chỉ', 'transfer pending': 'Chờ chuyển lớp', dropped: 'Thôi học' }
const STATUS_BADGE = { active: 'success', suspended: 'warning', 'transfer pending': 'info', dropped: 'danger' }

export default function TeacherClassDetail() {
  const { classId } = useParams()
  const [classInfo, setClassInfo] = useState(null)
  const [students, setStudents] = useState([])
  const [total, setTotal] = useState(0)
  const [studentPage, setStudentPage] = useState(1)
  const [studentPageSize, setStudentPageSize] = useState(10)
  const [statusFilter, setStatusFilter] = useState('')
  const [journalContent, setJournalContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [assignments, setAssignments] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', maxScore: 10 })
  const [showAddAssignment, setShowAddAssignment] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', pinned: false })
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false)
  const [messages, setMessages] = useState([])
  const [messageContent, setMessageContent] = useState('')

  const loadClass = () => {
    axiosClient.get(`/classes/${classId}`).then((res) => setClassInfo(res.data)).catch(ToastMessage.error)
  }
  const loadStudents = () => {
    const params = { page: studentPage - 1, size: studentPageSize }
    if (statusFilter) params.status = statusFilter
    axiosClient.get(`/classes/${classId}/students`, { params })
      .then((res) => { setStudents(res.data.data || []); setTotal(res.data.total ?? 0) })
      .catch(ToastMessage.error)
  }
  const loadAssignments = () => {
    if (!classId) return
    axiosClient.get(`/classes/${classId}/assignments`).then((res) => setAssignments(Array.isArray(res.data) ? res.data : [])).catch(() => setAssignments([]))
  }
  const loadAnnouncements = () => {
    if (!classId) return
    axiosClient.get(`/classes/${classId}/announcements`).then((res) => setAnnouncements(Array.isArray(res.data) ? res.data : [])).catch(() => setAnnouncements([]))
  }
  const loadMessages = () => {
    if (!classId) return
    axiosClient.get(`/classes/${classId}/messages`, { params: { limit: 50 } }).then((res) => setMessages(res.data.data || [])).catch(() => setMessages([]))
  }
  useEffect(() => { loadClass() }, [classId])
  useEffect(() => { if (classId) loadStudents() }, [classId, statusFilter, studentPage, studentPageSize])
  useEffect(() => { if (classId) { loadAssignments(); loadAnnouncements(); loadMessages() } }, [classId])
  useEffect(() => { setLoading(false) }, [classInfo])

  const handleSubmitJournal = (e) => {
    e.preventDefault()
    if (!journalContent.trim()) return
    axiosClient.post(`/journals/classes/${classId}/journals`, { content: journalContent })
      .then(() => { ToastMessage.success('Đã lưu nhật ký lớp'); setJournalContent('') })
      .catch(ToastMessage.error)
  }
  const handleCreateAssignment = (e) => {
    e.preventDefault()
    if (!newAssignment.title.trim()) return
    axiosClient.post(`/classes/${classId}/assignments`, {
      title: newAssignment.title,
      description: newAssignment.description,
      dueDate: newAssignment.dueDate || undefined,
      maxScore: newAssignment.maxScore,
    })
      .then(() => { ToastMessage.success('Đã thêm bài tập'); setNewAssignment({ title: '', description: '', dueDate: '', maxScore: 10 }); setShowAddAssignment(false); loadAssignments() })
      .catch(ToastMessage.error)
  }
  const handleCreateAnnouncement = (e) => {
    e.preventDefault()
    if (!newAnnouncement.title.trim()) return
    axiosClient.post(`/classes/${classId}/announcements`, { title: newAnnouncement.title, content: newAnnouncement.content, pinned: newAnnouncement.pinned })
      .then(() => { ToastMessage.success('Đã đăng thông báo'); setNewAnnouncement({ title: '', content: '', pinned: false }); setShowAddAnnouncement(false); loadAnnouncements() })
      .catch(ToastMessage.error)
  }
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!messageContent.trim()) return
    axiosClient.post(`/classes/${classId}/messages`, { content: messageContent.trim() })
      .then(() => { setMessageContent(''); loadMessages() })
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
            <div className="flex items-center gap-3">
              <Link to={`/teacher/classes/${classId}/learning-report`} className="text-cyan-600 text-sm font-medium hover:underline">Báo cáo học tập</Link>
              <FaFilter className="text-slate-400 text-sm" />
              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setStudentPage(1) }} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
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
          {total > 0 && (
            <Pagination
              page={studentPage}
              total={total}
              pageSize={studentPageSize}
              onPageChange={setStudentPage}
              onPageSizeChange={(s) => { setStudentPageSize(s); setStudentPage(1) }}
            />
          )}
        </div>
      </section>

      <section className="card">
        <div className="card-body">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <FaTasks className="text-lg" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Bài tập</h2>
                <p className="text-sm text-slate-500">{assignments.length} bài tập</p>
              </div>
            </div>
            <button type="button" onClick={() => setShowAddAssignment(!showAddAssignment)} className="btn-secondary text-sm">+ Thêm bài tập</button>
          </div>
          {showAddAssignment && (
            <form onSubmit={handleCreateAssignment} className="mb-4 p-4 bg-amber-50/50 rounded-xl space-y-3">
              <input type="text" value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} placeholder="Tiêu đề bài tập" className="w-full border rounded-xl px-4 py-2" required />
              <textarea value={newAssignment.description} onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} placeholder="Mô tả (tùy chọn)" rows={2} className="w-full border rounded-xl px-4 py-2" />
              <div className="flex gap-3 flex-wrap">
                <input type="datetime-local" value={newAssignment.dueDate} onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} className="border rounded-xl px-4 py-2" />
                <input type="number" min={0} value={newAssignment.maxScore} onChange={(e) => setNewAssignment({ ...newAssignment, maxScore: Number(e.target.value) })} placeholder="Điểm tối đa" className="border rounded-xl px-4 py-2 w-24" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary text-sm">Tạo bài tập</button>
                <button type="button" onClick={() => setShowAddAssignment(false)} className="btn-secondary text-sm">Hủy</button>
              </div>
            </form>
          )}
          <ul className="space-y-2">
            {assignments.map((a) => (
              <li key={a._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <span className="font-medium text-slate-800">{a.title}</span>
                  {a.dueDate && <span className="ml-2 text-xs text-slate-500">Hạn: {new Date(a.dueDate).toLocaleString('vi')}</span>}
                </div>
                <Link to={`/teacher/classes/${classId}/assignments/${a._id}`} className="text-amber-600 text-sm font-medium hover:underline">Xem bài nộp</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card">
        <div className="card-body">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <FaBullhorn className="text-lg" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Thông báo</h2>
                <p className="text-sm text-slate-500">{announcements.length} thông báo</p>
              </div>
            </div>
            <button type="button" onClick={() => setShowAddAnnouncement(!showAddAnnouncement)} className="btn-secondary text-sm">+ Đăng thông báo</button>
          </div>
          {showAddAnnouncement && (
            <form onSubmit={handleCreateAnnouncement} className="mb-4 p-4 bg-blue-50/50 rounded-xl space-y-3">
              <input type="text" value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} placeholder="Tiêu đề" className="w-full border rounded-xl px-4 py-2" required />
              <textarea value={newAnnouncement.content} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} placeholder="Nội dung" rows={3} className="w-full border rounded-xl px-4 py-2" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={newAnnouncement.pinned} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, pinned: e.target.checked })} />
                <span className="text-sm">Ghim lên đầu</span>
              </label>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary text-sm">Đăng</button>
                <button type="button" onClick={() => setShowAddAnnouncement(false)} className="btn-secondary text-sm">Hủy</button>
              </div>
            </form>
          )}
          <ul className="space-y-3">
            {announcements.map((ann) => (
              <li key={ann._id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  {ann.pinned && <span className="text-blue-500 text-xs font-medium">Ghim</span>}
                  <span className="font-medium text-slate-800">{ann.title}</span>
                  <span className="text-xs text-slate-400">{ann.authorId?.fullName} · {new Date(ann.createdAt).toLocaleDateString('vi')}</span>
                </div>
                {ann.content && <p className="mt-1 text-sm text-slate-600">{ann.content}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card">
        <div className="card-body">
          <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <FaComments className="text-rose-500" /> Chat lớp
          </h2>
          <div className="max-h-64 overflow-y-auto space-y-2 mb-3 p-2 bg-slate-50 rounded-xl">
            {messages.length === 0 && <p className="text-slate-500 text-sm">Chưa có tin nhắn.</p>}
            {messages.map((m) => (
              <div key={m._id} className="flex gap-2 text-sm">
                <span className="font-medium text-slate-700 shrink-0">{m.senderId?.fullName}:</span>
                <span className="text-slate-800">{m.content}</span>
                <span className="text-slate-400 text-xs shrink-0">{new Date(m.createdAt).toLocaleString('vi')}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input type="text" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} placeholder="Nhắn tin..." className="flex-1 rounded-xl border border-slate-200 px-4 py-2" />
            <button type="submit" className="btn-primary text-sm">Gửi</button>
          </form>
        </div>
      </section>
    </div>
  )
}
