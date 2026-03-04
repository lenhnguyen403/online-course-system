import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCourseModules, getLesson, getMyProgressByCourse, markLessonCompleted } from '../../api/contentApi'
import ToastMessage from '../../messages/ToastMessage'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import PageHeader from '../../components/ui/PageHeader'
import { FaCheckCircle, FaCircle, FaPlay, FaFileAlt, FaVideo, FaCode } from 'react-icons/fa'

const lessonTypeIcons = {
  video: FaVideo,
  pdf: FaFileAlt,
  text: FaFileAlt,
  quiz: FaCode,
  assignment: FaCode,
}

export default function StudentCourseContent() {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [progress, setProgress] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [completing, setCompleting] = useState(false)

  const progressByLesson = progress?.lessonProgress?.reduce((acc, p) => {
    acc[String(p.lessonId)] = p
    return acc
  }, {}) || {}

  useEffect(() => {
    if (!courseId) return
    setLoading(true)
    Promise.all([
      getCourseModules(courseId),
      getMyProgressByCourse(courseId).catch(() => null),
    ])
      .then(([contentRes, progressRes]) => {
        const mods = Array.isArray(contentRes.modules) ? contentRes.modules : contentRes
        const crs = contentRes.course || { courseName: 'Khóa học' }
        setCourse(crs)
        setModules(mods)
        setProgress(progressRes)
        setLoading(false)
      })
      .catch((err) => {
        ToastMessage.error(err?.response?.data?.message || err?.message || 'Tải nội dung thất bại')
        setLoading(false)
      })
  }, [courseId])

  useEffect(() => {
    if (!lessonId || !courseId || !modules.length) {
      setCurrentLesson(null)
      return
    }
    setCurrentLesson(null)
    getLesson(courseId, lessonId)
      .then((lesson) => setCurrentLesson(lesson))
      .catch(() => ToastMessage.error('Không tải được bài học'))
  }, [courseId, lessonId, modules.length])

  const handleMarkComplete = () => {
    if (!lessonId) return
    setCompleting(true)
    markLessonCompleted(lessonId)
      .then(() => {
        ToastMessage.success('Đã đánh dấu hoàn thành')
        getMyProgressByCourse(courseId).then(setProgress)
      })
      .catch((err) => ToastMessage.error(err?.response?.data?.message || 'Lỗi'))
      .finally(() => setCompleting(false))
  }

  const isCompleted = lessonId && progressByLesson[String(lessonId)]?.status === 'completed'
  const percent = progress?.percentCompleted ?? 0

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { to: '/student', label: 'Trang chủ' },
          { to: '/student/classes', label: 'Lớp của tôi' },
          { label: course?.courseName || 'Nội dung khóa học' },
        ]}
        title={course?.courseName || 'Nội dung khóa học'}
        description="Học theo từng bài và đánh dấu hoàn thành."
      />

      {/* Progress bar */}
      {progress != null && (
        <div className="card card-body">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Tiến độ</span>
            <div className="flex items-center gap-2">
              {percent === 100 && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Đã hoàn thành khóa</span>
              )}
              <span className="text-sm font-bold text-cyan-600">{percent}%</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar: modules & lessons */}
        <aside className="lg:w-80 shrink-0">
          <div className="card overflow-hidden">
            <div className="card-body p-0">
              {modules.length === 0 ? (
                <p className="p-4 text-slate-500 text-sm">Chưa có nội dung bài học.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {modules.map((mod) => (
                    <li key={mod._id}>
                      <div className="px-4 py-2.5 bg-slate-50 font-semibold text-slate-800 text-sm">
                        {mod.title}
                      </div>
                      <ul className="pb-2">
                        {(mod.lessons || []).map((les) => {
                          const done = progressByLesson[String(les._id)]?.status === 'completed'
                          const active = lessonId === les._id
                          const Icon = lessonTypeIcons[les.lessonType] || FaPlay
                          return (
                            <li key={les._id}>
                              <Link
                                to={`/student/courses/${courseId}/lessons/${les._id}`}
                                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                  active
                                    ? 'bg-cyan-50 text-cyan-700 font-medium'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {done ? (
                                  <FaCheckCircle className="text-cyan-500 shrink-0" />
                                ) : (
                                  <FaCircle className="text-slate-300 shrink-0" />
                                )}
                                <Icon className="text-slate-400 shrink-0" />
                                <span className="truncate">{les.title}</span>
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </aside>

        {/* Main: lesson content */}
        <main className="flex-1 min-w-0">
          <div className="card card-body">
            {!lessonId ? (
              <div className="text-center py-12 text-slate-500">
                <p>Chọn một bài học ở sidebar để bắt đầu.</p>
              </div>
            ) : !currentLesson ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-800">{currentLesson.title}</h2>
                  {progress != null && (
                    <button
                      type="button"
                      onClick={handleMarkComplete}
                      disabled={isCompleted || completing}
                      className={`btn-primary text-sm ${isCompleted ? 'opacity-70 cursor-default' : ''}`}
                    >
                      {isCompleted ? 'Đã hoàn thành' : completing ? 'Đang lưu...' : 'Đánh dấu hoàn thành'}
                    </button>
                  )}
                </div>
                <div className="mt-4 text-slate-600 text-sm">
                  Loại: {currentLesson.lessonType} {currentLesson.durationMinutes > 0 && ` • ${currentLesson.durationMinutes} phút`}
                </div>
                <div className="mt-6 prose prose-slate max-w-none">
                  {currentLesson.lessonType === 'video' && currentLesson.resourceUrl && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-slate-900">
                      <iframe
                        title={currentLesson.title}
                        src={currentLesson.resourceUrl}
                        className="w-full h-full"
                        allowFullScreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  )}
                  {currentLesson.lessonType === 'text' && currentLesson.content && (
                    <div
                      className="rounded-xl border border-slate-200 p-4 bg-slate-50/50"
                      dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                    />
                  )}
                  {currentLesson.lessonType === 'pdf' && currentLesson.resourceUrl && (
                    <iframe
                      title={currentLesson.title}
                      src={currentLesson.resourceUrl}
                      className="w-full rounded-xl border border-slate-200"
                      style={{ minHeight: '60vh' }}
                    />
                  )}
                  {(!currentLesson.content && !currentLesson.resourceUrl) &&
                    currentLesson.lessonType !== 'quiz' &&
                    currentLesson.lessonType !== 'assignment' && (
                      <p className="text-slate-500">Nội dung đang được cập nhật.</p>
                    )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
