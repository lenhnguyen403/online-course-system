import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { FaBookOpen, FaGraduationCap } from 'react-icons/fa'

export default function StudentMyCourses() {
  const [report, setReport] = useState([])
  const [completions, setCompletions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axiosClient.get('/me/learning-report').then((res) => setReport(Array.isArray(res.data) ? res.data : [])).catch(() => []),
      axiosClient.get('/me/completions').then((res) => setCompletions(Array.isArray(res.data) ? res.data : [])).catch(() => []),
    ]).finally(() => setLoading(false))
  }, [])

  const byCourse = {}
  report.forEach((r) => {
    const id = r.courseId?.toString?.() || r.courseId
    if (!id) return
    if (!byCourse[id]) {
      byCourse[id] = {
        courseId: id,
        courseName: r.courseName,
        classes: [],
        maxPercent: 0,
        totalLessons: 0,
        completedCount: 0,
      }
    }
    const p = r.progress?.percentCompleted ?? 0
    byCourse[id].classes.push({ className: r.className, classCode: r.classCode, classId: r.classId, progress: r.progress })
    if (p > byCourse[id].maxPercent) byCourse[id].maxPercent = p
    byCourse[id].totalLessons = Math.max(byCourse[id].totalLessons, r.progress?.totalLessons ?? 0)
    byCourse[id].completedCount = Math.max(byCourse[id].completedCount, r.progress?.completedCount ?? 0)
  })
  const courses = Object.values(byCourse)
  const completionIds = new Set((completions || []).map((c) => c.courseId?._id?.toString?.() || c.courseId?.toString?.()))

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { label: 'Khóa học của tôi' }]}
        title="Khóa học của tôi"
        description="Các khóa bạn đang học với tiến độ. Hoàn thành 100% để nhận chứng nhận."
      />

      {courses.length === 0 ? (
        <div className="card">
          <EmptyState icon={FaBookOpen} title="Chưa có khóa nào" description="Bạn chưa đăng ký lớp hoặc chưa có tiến độ học." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div key={c.courseId} className="card card-body border border-slate-200 hover:border-cyan-200 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                  <FaBookOpen className="text-xl" />
                </div>
                {completionIds.has(c.courseId) && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 flex items-center gap-1">
                    <FaGraduationCap /> Đã hoàn thành
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-bold text-slate-800">{c.courseName}</h3>
              <p className="text-sm text-slate-500 mt-1">
                {c.classes.map((cl) => cl.className).join(', ')}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, c.maxPercent)}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${c.maxPercent >= 100 ? 'text-green-600' : 'text-slate-600'}`}>
                  {c.maxPercent ?? 0}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{c.completedCount} / {c.totalLessons} bài học</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to={`/student/courses/${c.courseId}`} className="text-cyan-600 text-sm font-medium hover:underline">
                  Học nội dung →
                </Link>
                {completionIds.has(c.courseId) && (
                  <Link to={`/student/certificate/${c.courseId}`} className="text-amber-600 text-sm font-medium hover:underline">
                    Xem chứng nhận
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
