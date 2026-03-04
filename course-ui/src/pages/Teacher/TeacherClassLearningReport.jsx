import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function TeacherClassLearningReport() {
  const { classId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get(`/dashboard/class/${classId}/learning-report`)
      .then((res) => setData(res.data))
      .catch(ToastMessage.error)
      .finally(() => setLoading(false))
  }, [classId])

  if (loading && !data) return <LoadingSpinner />

  const cls = data?.class || {}
  const students = data?.students || []

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { to: '/teacher', label: 'Tổng quan' },
          { to: '/teacher/classes', label: 'Lớp của tôi' },
          { to: `/teacher/classes/${classId}`, label: cls.className || 'Lớp' },
          { label: 'Báo cáo học tập' },
        ]}
        title={`Báo cáo học tập: ${cls.className || 'Lớp'}`}
        description={data?.courseName ? `Khóa: ${data.courseName}` : 'Tiến độ học viên theo nội dung khóa.'}
      />

      <div className="card card-body">
        <p className="text-sm text-slate-500 mb-4">Tổng: {students.length} học viên</p>
        {students.length === 0 ? (
          <p className="text-slate-500">Chưa có học viên hoặc chưa có dữ liệu tiến độ.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 text-left">
                  <th className="pb-3 pr-4">Học viên</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4 text-right">Tiến độ</th>
                  <th className="pb-3 pr-4 text-right">Bài đã học</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.studentId || i} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium text-slate-800">{s.fullName}</td>
                    <td className="py-3 pr-4 text-slate-500">{s.email}</td>
                    <td className="py-3 pr-4 text-right">
                      <span className={`font-medium ${(s.progress?.percentCompleted || 0) >= 100 ? 'text-green-600' : 'text-amber-600'}`}>
                        {s.progress?.percentCompleted ?? 0}%
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right text-slate-500">
                      {s.progress?.completedCount ?? 0} / {s.progress?.totalLessons ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Link to={`/teacher/classes/${classId}`} className="mt-4 inline-block text-cyan-600 text-sm hover:underline">← Quay lại chi tiết lớp</Link>
      </div>
    </div>
  )
}
