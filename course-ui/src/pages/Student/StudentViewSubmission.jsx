import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function StudentViewSubmission() {
  const { classId, assignmentId, submissionId } = useParams()
  const [assignment, setAssignment] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axiosClient.get(`/classes/${classId}/assignments/${assignmentId}`),
      axiosClient.get(`/classes/${classId}/assignments/${assignmentId}/submissions/${submissionId}`),
    ])
      .then(([a, s]) => { setAssignment(a.data); setSubmission(s.data) })
      .catch(() => ToastMessage.error('Không tải được'))
      .finally(() => setLoading(false))
  }, [classId, assignmentId, submissionId])

  if (loading || !submission) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { to: '/student', label: 'Trang chủ' },
          { to: '/student/assignments', label: 'Bài tập' },
          { label: assignment?.title || 'Bài nộp' },
        ]}
        title={assignment?.title || 'Bài nộp'}
      />

      <div className="card card-body max-w-2xl">
        <p className="text-sm text-slate-500">Nộp lúc: {new Date(submission.submittedAt).toLocaleString('vi')}</p>
        {submission.content && <div className="mt-4 p-4 bg-slate-50 rounded-xl whitespace-pre-wrap text-slate-800">{submission.content}</div>}
        {submission.score != null && <p className="mt-4 font-medium text-amber-600">Điểm: {submission.score}{assignment?.maxScore != null && `/${assignment.maxScore}`}</p>}
        {submission.feedback && <p className="mt-2 text-slate-600">Nhận xét: {submission.feedback}</p>}
        <Link to="/student/assignments" className="btn-secondary mt-6">Quay lại Bài tập</Link>
      </div>
    </div>
  )
}
