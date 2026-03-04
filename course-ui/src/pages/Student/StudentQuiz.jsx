import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function StudentQuiz() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [attempt, setAttempt] = useState(null)

  useEffect(() => {
    axiosClient.get(`/exams/exams/${examId}/quiz/my-attempt`)
      .then((res) => {
        if (res.data) setAttempt(res.data)
      })
      .catch(() => {})
    axiosClient.get(`/exams/exams/${examId}/quiz`)
      .then((res) => setQuestions(Array.isArray(res.data) ? res.data : []))
      .catch((err) => ToastMessage.error(err?.response?.data?.message || 'Không tải được đề'))
      .finally(() => setLoading(false))
  }, [examId])

  const handleSubmit = (e) => {
    e.preventDefault()
    const answerList = questions.map((q) => ({
      questionId: q._id,
      optionIndex: answers[q._id] ?? 0,
    }))
    setSubmitting(true)
    axiosClient.post(`/exams/exams/${examId}/quiz/submit`, { answers: answerList })
      .then((res) => {
        setAttempt(res.data)
        ToastMessage.success('Đã nộp bài. Điểm: ' + (res.data?.score ?? 0) + '/' + (res.data?.maxScore ?? 0))
      })
      .catch((err) => ToastMessage.error(err?.response?.data?.message || 'Nộp bài thất bại'))
      .finally(() => setSubmitting(false))
  }

  if (loading) return <LoadingSpinner />

  if (attempt) {
    return (
      <div className="space-y-6">
        <PageHeader breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { to: '/student/exams', label: 'Điểm thi' }, { label: 'Kết quả quiz' }]} title="Kết quả bài làm" />
        <div className="card card-body max-w-md">
          <p className="text-lg font-bold text-slate-800">Điểm: {attempt.score} / {attempt.maxScore}</p>
          <p className="text-sm text-slate-500">Nộp lúc: {new Date(attempt.submittedAt).toLocaleString('vi')}</p>
          <Link to="/student/exams" className="btn-secondary mt-4">Quay lại Điểm thi</Link>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Quiz" />
        <div className="card card-body">
          <p className="text-slate-500">Không có câu hỏi hoặc bạn đã nộp bài.</p>
          <Link to="/student/exams" className="btn-secondary mt-4">Quay lại Điểm thi</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { to: '/student/exams', label: 'Điểm thi' }, { label: 'Làm bài quiz' }]} title="Làm bài quiz" description={`${questions.length} câu hỏi`} />

      <form onSubmit={handleSubmit} className="card card-body space-y-6">
        {questions.map((q, idx) => (
          <div key={q._id} className="border-b border-slate-100 pb-4 last:border-0">
            <p className="font-medium text-slate-800 mb-2">{idx + 1}. {q.questionText}</p>
            <ul className="space-y-2">
              {(q.options || []).map((opt, oi) => (
                <li key={oi}>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name={q._id} value={oi} checked={(answers[q._id] ?? 0) === oi} onChange={() => setAnswers((prev) => ({ ...prev, [q._id]: oi }))} className="rounded-full" />
                    <span className="text-slate-700">{opt.text}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="flex gap-2 pt-4">
          <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Đang nộp...' : 'Nộp bài'}</button>
          <Link to="/student/exams" className="btn-secondary">Hủy</Link>
        </div>
      </form>
    </div>
  )
}
