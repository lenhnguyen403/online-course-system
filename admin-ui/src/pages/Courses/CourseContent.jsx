import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const LESSON_TYPES = [
  { value: 'video', label: 'Video' },
  { value: 'pdf', label: 'PDF' },
  { value: 'text', label: 'Văn bản' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'assignment', label: 'Bài tập' },
]

export default function CourseContent() {
  const { id: courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [addingModule, setAddingModule] = useState(false)
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [addingLesson, setAddingLesson] = useState(null)
  const [lessonForm, setLessonForm] = useState({ title: '', lessonType: 'text', content: '', resourceUrl: '', durationMinutes: 0 })

  const load = () => {
    setLoading(true)
    axiosClient.get(`/courses/${courseId}/modules`)
      .then((res) => {
        const data = res.data
        setCourse(data.course || { courseName: 'Khóa học' })
        setModules(Array.isArray(data.modules) ? data.modules : [])
      })
      .catch((err) => ToastMessage.error(err?.response?.data?.message || 'Tải nội dung thất bại'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!courseId) return
    load()
  }, [courseId])

  const handleAddModule = (e) => {
    e.preventDefault()
    if (!newModuleTitle.trim()) return
    axiosClient.post(`/courses/${courseId}/modules`, { title: newModuleTitle.trim(), description: '' })
      .then(() => {
        ToastMessage.success('Đã thêm chương')
        setNewModuleTitle('')
        setAddingModule(false)
        load()
      })
      .catch((err) => ToastMessage.error(err?.response?.data?.message || 'Lỗi'))
  }

  const handleAddLesson = (e) => {
    e.preventDefault()
    if (!addingLesson || !lessonForm.title.trim()) return
    axiosClient.post(`/courses/${courseId}/modules/${addingLesson}/lessons`, {
      title: lessonForm.title.trim(),
      lessonType: lessonForm.lessonType,
      content: lessonForm.content || '',
      resourceUrl: lessonForm.resourceUrl || '',
      durationMinutes: Number(lessonForm.durationMinutes) || 0,
    })
      .then(() => {
        ToastMessage.success('Đã thêm bài học')
        setAddingLesson(null)
        setLessonForm({ title: '', lessonType: 'text', content: '', resourceUrl: '', durationMinutes: 0 })
        load()
      })
      .catch((err) => ToastMessage.error(err?.response?.data?.message || 'Lỗi'))
  }

  const handleDeactivateModule = (moduleId) => {
    if (!window.confirm('Ẩn chương này?')) return
    axiosClient.patch(`/courses/${courseId}/modules/${moduleId}/deactivate`)
      .then(() => { ToastMessage.success('Đã ẩn chương'); load() })
      .catch((err) => ToastMessage.error(err?.response?.data?.message || 'Lỗi'))
  }

  const handleDeactivateLesson = (lessonId) => {
    if (!window.confirm('Ẩn bài học này?')) return
    axiosClient.patch(`/courses/${courseId}/lessons/${lessonId}/deactivate`)
      .then(() => { ToastMessage.success('Đã ẩn bài học'); load() })
      .catch((err) => ToastMessage.error(err?.response?.data?.message || 'Lỗi'))
  }

  if (loading && !modules.length) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { to: '/dashboard/courses', label: 'Khóa học' },
          { to: `/dashboard/courses/${courseId}`, label: course?.courseName || 'Chi tiết' },
          { label: 'Nội dung khóa học' },
        ]}
        title="Nội dung khóa học"
        description="Quản lý chương và bài học."
      />

      <div className="card card-body space-y-6">
        {addingModule && (
          <form onSubmit={handleAddModule} className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm text-slate-500 mb-1">Tên chương</label>
              <input
                type="text"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="VD: Chương 1 - Giới thiệu"
                className="w-full border rounded-xl px-4 py-2"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary">Thêm</button>
            <button type="button" onClick={() => { setAddingModule(false); setNewModuleTitle('') }} className="btn-secondary">Hủy</button>
          </form>
        )}
        {!addingModule && (
          <button type="button" onClick={() => setAddingModule(true)} className="btn-secondary">
            + Thêm chương
          </button>
        )}

        {modules.length === 0 && !addingModule && (
          <p className="text-slate-500">Chưa có chương nào. Thêm chương để bắt đầu.</p>
        )}

        {modules.map((mod) => (
          <div key={mod._id} className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
              <h3 className="font-semibold text-slate-800">{mod.title}</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAddingLesson(mod._id)}
                  className="text-sm text-cyan-600 hover:underline"
                >
                  + Thêm bài học
                </button>
                <button
                  type="button"
                  onClick={() => handleDeactivateModule(mod._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Ẩn chương
                </button>
              </div>
            </div>
            {addingLesson === mod._id && (
              <form onSubmit={handleAddLesson} className="p-4 bg-amber-50/50 border-t border-slate-100 space-y-3">
                <input
                  type="text"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="Tên bài học"
                  className="w-full border rounded-xl px-4 py-2"
                  required
                />
                <select
                  value={lessonForm.lessonType}
                  onChange={(e) => setLessonForm({ ...lessonForm, lessonType: e.target.value })}
                  className="border rounded-xl px-4 py-2"
                >
                  {LESSON_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                {(lessonForm.lessonType === 'video' || lessonForm.lessonType === 'pdf') && (
                  <input
                    type="url"
                    value={lessonForm.resourceUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, resourceUrl: e.target.value })}
                    placeholder="URL video / PDF"
                    className="w-full border rounded-xl px-4 py-2"
                  />
                )}
                {lessonForm.lessonType === 'text' && (
                  <textarea
                    value={lessonForm.content}
                    onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                    placeholder="Nội dung (có thể dùng HTML)"
                    rows={4}
                    className="w-full border rounded-xl px-4 py-2"
                  />
                )}
                <input
                  type="number"
                  min={0}
                  value={lessonForm.durationMinutes}
                  onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: e.target.value })}
                  placeholder="Thời lượng (phút)"
                  className="w-full border rounded-xl px-4 py-2"
                />
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary">Thêm bài học</button>
                  <button type="button" onClick={() => { setAddingLesson(null); setLessonForm({ title: '', lessonType: 'text', content: '', resourceUrl: '', durationMinutes: 0 }); }} className="btn-secondary">Hủy</button>
                </div>
              </form>
            )}
            <ul className="divide-y divide-slate-100">
              {(mod.lessons || []).map((les) => (
                <li key={les._id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-slate-700">{les.title}</span>
                  <span className="text-slate-400">{les.lessonType}</span>
                  <button
                    type="button"
                    onClick={() => handleDeactivateLesson(les._id)}
                    className="text-red-600 hover:underline"
                  >
                    Ẩn
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
