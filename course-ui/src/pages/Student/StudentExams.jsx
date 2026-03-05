import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Pagination from '../../components/ui/Pagination'
import { FaChartBar, FaEdit } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function ScoreCell({ value }) {
  if (value == null || value === '') return <span className="text-slate-400">—</span>
  const n = Number(value)
  if (isNaN(n)) return <span>{value}</span>
  return (
    <span className={`font-semibold ${n >= 8 ? 'text-emerald-600' : n >= 5 ? 'text-amber-600' : 'text-red-600'}`}>
      {n.toFixed(2)}
    </span>
  )
}

export default function StudentExams() {
  const [user, setUser] = useState(null)
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [quizExams, setQuizExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}')
    if (u.id) setUser(u)
    else setLoading(false)
  }, [])

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    Promise.all([
      axiosClient.get(`/exams/students/${user.id}/results`, { params: { page: page - 1, size: pageSize } })
        .then((res) => { setList(res.data.data || []); setTotal(res.data.total ?? 0) })
        .catch(ToastMessage.error),
      page === 1
        ? axiosClient.get('/me/classes', { params: { page: 0, size: 100 } })
            .then((res) => {
              const classes = res.data.data || []
              return Promise.all(classes.map((c) => axiosClient.get(`/exams/classes/${c._id}/exams`).then((r) => (Array.isArray(r.data) ? r.data : []).map((e) => ({ ...e, className: c.className }))).catch(() => [])))
            })
            .then((arr) => setQuizExams(arr.flat().filter((e) => e.examType === 'quiz')))
            .catch(() => {})
        : Promise.resolve(),
    ]).finally(() => setLoading(false))
  }, [user?.id, page, pageSize])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-8">
      <PageHeader breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { label: 'Điểm thi' }]} title="Điểm các bài kiểm tra" description="Xem điểm lý thuyết, thực hành và trung bình theo từng đợt thi." />

      {quizExams.length > 0 && (
        <div className="card card-body">
          <h3 className="font-bold text-slate-800 mb-3">Quiz trực tuyến</h3>
          <ul className="space-y-2">
            {quizExams.map((e) => (
              <li key={e._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="font-medium text-slate-800">{e.title}</span>
                <span className="text-sm text-slate-500">{e.className}</span>
                <Link to={`/student/exams/${e._id}/quiz`} className="btn-primary text-sm inline-flex items-center gap-1">
                  <FaEdit className="text-xs" /> Làm bài
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {list.length === 0 ? (
        <div className="card">
          <EmptyState icon={FaChartBar} title="Chưa có điểm thi" description="Điểm các bài kiểm tra sẽ hiển thị tại đây sau khi giáo vụ nhập điểm." />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="text-left py-4 px-5 font-semibold text-slate-700">Bài thi / Lớp</th>
                  <th className="text-right py-4 px-5 font-semibold text-slate-700">Lý thuyết</th>
                  <th className="text-right py-4 px-5 font-semibold text-slate-700">Thực hành</th>
                  <th className="text-right py-4 px-5 font-semibold text-slate-700">Trung bình</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-medium text-slate-800">{r.examId?.title || '—'}</span>
                      {r.examId?.classId && <span className="text-slate-500 ml-1">({r.examId.classId.className})</span>}
                    </td>
                    <td className="py-4 px-5 text-right"><ScoreCell value={r.theoryScore} /></td>
                    <td className="py-4 px-5 text-right"><ScoreCell value={r.practiceScore} /></td>
                    <td className="py-4 px-5 text-right font-semibold text-slate-800">{r.averageScore != null ? Number(r.averageScore).toFixed(2) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
        </div>
      )}
    </div>
  )
}
