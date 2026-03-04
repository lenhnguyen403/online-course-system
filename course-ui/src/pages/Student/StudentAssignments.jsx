import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaTasks } from 'react-icons/fa'

export default function StudentAssignments() {
  const [classesWithAssignments, setClassesWithAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get('/me/classes', { params: { limit: 50 } })
      .then((res) => {
        const classList = res.data.data || []
        const classIds = classList.map((c) => c._id).filter(Boolean)
        if (classIds.length === 0) { setClassesWithAssignments([]); return }
        Promise.all(classIds.map((id) => axiosClient.get(`/classes/${id}/assignments`, { params: { mySubmissions: '1' } }).then((r) => ({ classId: id, classInfo: classList.find((x) => x._id === id), list: Array.isArray(r.data) ? r.data : [] })).catch(() => ({ classId: id, classInfo: classList.find((x) => x._id === id), list: [] }))))
          .then((results) => setClassesWithAssignments(results.filter((r) => r.list.length > 0)))
      })
      .catch(() => setClassesWithAssignments([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-8">
      <PageHeader breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { label: 'Bài tập' }]} title="Bài tập" description="Bài tập theo lớp và trạng thái nộp bài." />

      {classesWithAssignments.length === 0 ? (
        <div className="card card-body">
          <p className="text-slate-500">Chưa có bài tập nào hoặc bạn chưa có lớp.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {classesWithAssignments.map(({ classId, classInfo, list }) => (
            <div key={classId} className="card overflow-hidden">
              <div className="card-body">
                <h3 className="font-bold text-slate-800 mb-3">{classInfo?.className || classId} · {classInfo?.classCode}</h3>
                <ul className="space-y-2">
                  {list.map((item) => {
                    const sub = item.submission
                    const due = item.dueDate ? new Date(item.dueDate) : null
                    const isOverdue = due && new Date() > due
                    return (
                      <li key={item._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <FaTasks className="text-slate-400 shrink-0" />
                          <div>
                            <span className="font-medium text-slate-800">{item.title}</span>
                            {due && <span className={`ml-2 text-xs ${isOverdue ? 'text-red-500' : 'text-slate-500'}`}>Hạn: {due.toLocaleString('vi')}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {sub ? (
                            <>
                              {sub.score != null && <span className="text-sm font-medium text-amber-600">{sub.score}/{item.maxScore ?? 10}</span>}
                              <Link to={`/student/classes/${classId}/assignments/${item._id}/submissions/${sub._id}`} className="text-cyan-600 text-sm font-medium hover:underline">Xem bài nộp</Link>
                            </>
                          ) : (
                            <Link to={`/student/classes/${classId}/assignments/${item._id}/submit`} className="btn-primary text-sm">Nộp bài</Link>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
