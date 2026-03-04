import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { FaChartLine } from 'react-icons/fa'

export default function StudentLearningReport() {
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get('/me/learning-report')
      .then((res) => setReport(Array.isArray(res.data) ? res.data : []))
      .catch(() => setReport([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { label: 'Báo cáo học tập' }]}
        title="Báo cáo học tập"
        description="Tiến độ học tập theo từng lớp và khóa học."
      />

      {report.length === 0 ? (
        <div className="card">
          <EmptyState icon={FaChartLine} title="Chưa có dữ liệu" description="Bạn chưa có lớp học nào hoặc chưa có tiến độ." />
        </div>
      ) : (
        <div className="card card-body">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 text-left">
                  <th className="pb-3 pr-4">Lớp</th>
                  <th className="pb-3 pr-4">Khóa học</th>
                  <th className="pb-3 pr-4 text-right">Tiến độ</th>
                  <th className="pb-3 pr-4 text-right">Bài đã học</th>
                </tr>
              </thead>
              <tbody>
                {report.map((r, i) => (
                  <tr key={r.classId || i} className="border-b border-slate-100">
                    <td className="py-3 pr-4">
                      <span className="font-medium text-slate-800">{r.className}</span>
                      {r.classCode && <span className="text-slate-400 ml-1">({r.classCode})</span>}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{r.courseName}</td>
                    <td className="py-3 pr-4 text-right">
                      <span className={`font-medium ${(r.progress?.percentCompleted || 0) >= 100 ? 'text-green-600' : 'text-amber-600'}`}>
                        {r.progress?.percentCompleted ?? 0}%
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right text-slate-500">
                      {r.progress?.completedCount ?? 0} / {r.progress?.totalLessons ?? 0}
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
