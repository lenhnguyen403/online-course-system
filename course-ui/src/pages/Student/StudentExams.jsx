import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaChartBar } from 'react-icons/fa'

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}')
    if (!u.id) { setLoading(false); return }
    setUser(u)
    axiosClient.get(`/exams/students/${u.id}/results`, { params: { limit: 50 } })
      .then((res) => setList(res.data.data || []))
      .catch(ToastMessage.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-8">
      <PageHeader breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { label: 'Điểm thi' }]} title="Điểm các bài kiểm tra" description="Xem điểm lý thuyết, thực hành và trung bình theo từng đợt thi." />

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
        </div>
      )}
    </div>
  )
}
