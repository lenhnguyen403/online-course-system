import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function StudentClassChat() {
  const { classId } = useParams()
  const [classInfo, setClassInfo] = useState(null)
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get(`/classes/${classId}`).then((res) => setClassInfo(res.data)).catch(ToastMessage.error)
    axiosClient.get(`/classes/${classId}/messages`, { params: { limit: 50 } })
      .then((res) => setMessages(res.data.data || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false))
  }, [classId])

  const loadMessages = () => {
    axiosClient.get(`/classes/${classId}/messages`, { params: { limit: 50 } })
      .then((res) => setMessages(res.data.data || []))
      .catch(() => {})
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!content.trim()) return
    axiosClient.post(`/classes/${classId}/messages`, { content: content.trim() })
      .then(() => { setContent(''); loadMessages() })
      .catch(ToastMessage.error)
  }

  if (loading && !classInfo) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { to: '/student/classes', label: 'Lớp của tôi' }, { label: classInfo?.className || 'Chat' }]}
        title={`Chat: ${classInfo?.className || 'Lớp'}`}
        description="Tin nhắn giữa giảng viên và học viên trong lớp"
      />

      <div className="card card-body max-w-2xl">
        <div className="max-h-96 overflow-y-auto space-y-2 mb-4 p-3 bg-slate-50 rounded-xl">
          {messages.length === 0 && <p className="text-slate-500 text-sm">Chưa có tin nhắn.</p>}
          {messages.map((m) => (
            <div key={m._id} className="flex gap-2 text-sm">
              <span className="font-medium text-cyan-700 shrink-0">{m.senderId?.fullName}:</span>
              <span className="text-slate-800">{m.content}</span>
              <span className="text-slate-400 text-xs shrink-0">{new Date(m.createdAt).toLocaleString('vi')}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input type="text" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nhắn tin..." className="flex-1 rounded-xl border border-slate-200 px-4 py-2" />
          <button type="submit" className="btn-primary text-sm">Gửi</button>
        </form>
        <Link to="/student/classes" className="text-cyan-600 text-sm mt-4 inline-block hover:underline">← Quay lại Lớp của tôi</Link>
      </div>
    </div>
  )
}
