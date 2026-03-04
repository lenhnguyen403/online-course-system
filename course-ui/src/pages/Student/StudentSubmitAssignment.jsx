import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function StudentSubmitAssignment() {
  const { classId, assignmentId } = useParams()
  const navigate = useNavigate()
  const [assignment, setAssignment] = useState(null)
  const [content, setContent] = useState('')
  const [fileUrls, setFileUrls] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    axiosClient.get(`/classes/${classId}/assignments/${assignmentId}`)
      .then((res) => setAssignment(res.data))
      .catch(() => ToastMessage.error('Không tải được bài tập'))
      .finally(() => setLoading(false))
  }, [classId, assignmentId])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    axiosClient.post(`/classes/${classId}/assignments/${assignmentId}/submit`, { content, fileUrls })
      .then(() => {
        ToastMessage.success('Đã nộp bài')
        navigate(`/student/assignments`)
      })
      .catch((err) => ToastMessage.error(err?.response?.data?.message || 'Nộp bài thất bại'))
      .finally(() => setSubmitting(false))
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    axiosClient.post(`/classes/${classId}/assignments/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => { setFileUrls((prev) => [...prev, res.data.url]); e.target.value = '' })
      .catch((err) => ToastMessage.error(err?.response?.data?.message || 'Tải file thất bại'))
      .finally(() => setUploading(false))
  }

  if (loading || !assignment) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { to: '/student', label: 'Trang chủ' },
          { to: '/student/assignments', label: 'Bài tập' },
          { label: assignment.title },
        ]}
        title={assignment.title}
        description={assignment.description || 'Nộp bài tập'}
      />

      <div className="card card-body max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nội dung bài làm</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} className="w-full border rounded-xl px-4 py-3" placeholder="Nhập nội dung..." required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">File đính kèm (PDF, ảnh)</label>
            <input type="file" accept=".pdf,image/jpeg,image/png,image/gif" onChange={handleFileChange} disabled={uploading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-50 file:text-cyan-700" />
            {fileUrls.length > 0 && (
              <ul className="mt-2 space-y-1">
                {fileUrls.map((url, i) => (
                  <li key={i} className="flex items-center justify-between text-sm">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-cyan-600 truncate max-w-[200px]">File {i + 1}</a>
                    <button type="button" onClick={() => setFileUrls((prev) => prev.filter((_, j) => j !== i))} className="text-red-600 hover:underline">Xóa</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {assignment.dueDate && (
            <p className="text-sm text-slate-500">Hạn nộp: {new Date(assignment.dueDate).toLocaleString('vi')}</p>
          )}
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Đang nộp...' : 'Nộp bài'}</button>
            <Link to="/student/assignments" className="btn-secondary">Hủy</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
