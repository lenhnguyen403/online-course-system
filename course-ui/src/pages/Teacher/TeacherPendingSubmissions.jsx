import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { FaTasks, FaClipboardCheck } from 'react-icons/fa'

export default function TeacherPendingSubmissions() {
  const [data, setData] = useState({ data: [], total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get('/dashboard/teacher/pending-submissions', { params: { limit: 100 } })
      .then((res) => setData({ data: res.data.data || [], total: res.data.total ?? 0 }))
      .catch(() => setData({ data: [], total: 0 }))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const list = data.data || []

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ to: '/teacher', label: 'Tổng quan' }, { label: 'Bài nộp chờ chấm' }]}
        title="Bài nộp chờ chấm"
        description={`Tổng ${data.total} bài nộp chưa chấm điểm. Nhấn "Chấm bài" để vào trang chấm.`}
      />

      {list.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FaClipboardCheck}
            title="Không còn bài chờ chấm"
            description="Tất cả bài nộp đã được chấm điểm."
          />
        </div>
      ) : (
        <div className="card card-body">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 text-left">
                  <th className="pb-3 pr-4">Bài tập</th>
                  <th className="pb-3 pr-4">Lớp</th>
                  <th className="pb-3 pr-4">Học viên</th>
                  <th className="pb-3 pr-4">Nộp lúc</th>
                  <th className="pb-3 pr-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-3 pr-4 font-medium text-slate-800">{s.assignmentTitle}</td>
                    <td className="py-3 pr-4 text-slate-600">{s.className} {s.classCode && `(${s.classCode})`}</td>
                    <td className="py-3 pr-4">{s.studentName} <span className="text-slate-400">{s.studentEmail}</span></td>
                    <td className="py-3 pr-4 text-slate-500">{s.submittedAt ? new Date(s.submittedAt).toLocaleString('vi') : '—'}</td>
                    <td className="py-3 pr-4 text-right">
                      <Link
                        to={`/teacher/classes/${s.classId}/assignments/${s.assignmentId}`}
                        className="text-rose-600 font-medium hover:underline"
                      >
                        Chấm bài
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
