import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function ExamQuestionsPage() {
  const { classId, examId } = useParams()
  const [exam, setExam] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ questionText: '', type: 'mcq', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }], maxScore: 1 })

  const load = () => {
    axiosClient.get(`/exams/exams/${examId}`).then((res) => setExam(res.data)).catch(ToastMessage.error)
    axiosClient.get(`/exams/exams/${examId}/questions`)
      .then((res) => setQuestions(Array.isArray(res.data) ? res.data : []))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [examId])

  const handleAdd = (e) => {
    e.preventDefault()
    if (!form.questionText.trim()) return
    const payload = {
      questionText: form.questionText,
      type: form.type,
      maxScore: form.maxScore,
      options: form.type === 'true_false'
        ? [{ text: 'Đúng', isCorrect: true }, { text: 'Sai', isCorrect: false }]
        : (form.options || []).filter((o) => o.text?.trim()).map((o) => ({ text: o.text.trim(), isCorrect: !!o.isCorrect })),
    }
    if (payload.options.length < 2 && form.type === 'mcq') { ToastMessage.error('Cần ít nhất 2 đáp án'); return }
    axiosClient.post(`/exams/exams/${examId}/questions`, payload)
      .then(() => { ToastMessage.success('Đã thêm câu hỏi'); setAdding(false); setForm({ questionText: '', type: 'mcq', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }], maxScore: 1 }); load() })
      .catch(ToastMessage.error)
  }

  const handleDelete = (questionId) => {
    if (!window.confirm('Ẩn câu hỏi này?')) return
    axiosClient.patch(`/exams/exams/${examId}/questions/${questionId}/deactivate`)
      .then(() => { ToastMessage.success('Đã ẩn'); load() })
      .catch(ToastMessage.error)
  }

  if (loading && !exam) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { to: '/dashboard/classes', label: 'Lớp học' },
          { to: `/dashboard/classes/${classId}`, label: 'Chi tiết lớp' },
          { to: `/dashboard/classes/${classId}/exams/${examId}/results`, label: exam?.title || 'Điểm' },
          { label: 'Câu hỏi quiz' },
        ]}
        title="Câu hỏi quiz"
        description={exam?.title}
      />

      <div className="card card-body">
        {!adding ? (
          <button type="button" onClick={() => setAdding(true)} className="btn-secondary mb-4">+ Thêm câu hỏi</button>
        ) : (
          <form onSubmit={handleAdd} className="mb-6 p-4 bg-slate-50 rounded-xl space-y-3">
            <input type="text" value={form.questionText} onChange={(e) => setForm({ ...form, questionText: e.target.value })} placeholder="Nội dung câu hỏi" className="w-full border rounded-xl px-4 py-2" required />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border rounded-xl px-4 py-2">
              <option value="mcq">Trắc nghiệm (nhiều đáp án)</option>
              <option value="true_false">Đúng / Sai</option>
            </select>
            {form.type === 'mcq' && (
              <div className="space-y-2">
                <label className="block text-sm text-slate-600">Đáp án</label>
                {(form.options || []).map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="text" value={opt.text} onChange={(e) => setForm({ ...form, options: form.options.map((o, j) => j === i ? { ...o, text: e.target.value } : o) })} placeholder={`Đáp án ${i + 1}`} className="flex-1 border rounded-lg px-3 py-1" />
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="correct" checked={opt.isCorrect} onChange={() => setForm({ ...form, options: form.options.map((o, j) => ({ ...o, isCorrect: j === i })) })} />
                      Đúng
                    </label>
                  </div>
                ))}
              </div>
            )}
            <input type="number" min={0.5} step={0.5} value={form.maxScore} onChange={(e) => setForm({ ...form, maxScore: Number(e.target.value) })} className="border rounded-lg px-3 py-1 w-20" />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-sm">Thêm</button>
              <button type="button" onClick={() => setAdding(false)} className="btn-secondary text-sm">Hủy</button>
            </div>
          </form>
        )}

        <ul className="space-y-4">
          {questions.map((q, idx) => (
            <li key={q._id} className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-800">{idx + 1}. {q.questionText}</p>
                  <p className="text-xs text-slate-500 mt-1">{q.type} · Điểm: {q.maxScore}</p>
                  <ul className="mt-2 space-y-1">
                    {(q.options || []).map((o, i) => (
                      <li key={i} className="text-sm text-slate-600">{o.isCorrect ? '✓ ' : ''}{o.text}</li>
                    ))}
                  </ul>
                </div>
                <button type="button" onClick={() => handleDelete(q._id)} className="text-red-600 text-sm hover:underline">Ẩn</button>
              </div>
            </li>
          ))}
        </ul>
        {questions.length === 0 && !adding && <p className="text-slate-500">Chưa có câu hỏi. Thêm câu hỏi để học viên làm quiz.</p>}
      </div>
    </div>
  )
}
