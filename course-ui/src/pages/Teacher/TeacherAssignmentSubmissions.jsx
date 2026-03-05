import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Pagination from '../../components/ui/Pagination'

export default function TeacherAssignmentSubmissions() {
  const { classId, assignmentId } = useParams()
  const [assignment, setAssignment] = useState(null)
  const [submissionsList, setSubmissionsList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [grading, setGrading] = useState(null)
  const [gradeForm, setGradeForm] = useState({ score: '', feedback: '', rubricScores: [] })

  useEffect(() => {
    axiosClient.get(`/classes/${classId}/assignments/${assignmentId}`)
      .then((res) => setAssignment(res.data))
      .catch(ToastMessage.error)
  }, [classId, assignmentId])

  const loadSubmissions = () => {
    setLoading(true)
    axiosClient.get(`/classes/${classId}/assignments/${assignmentId}/submissions`, { params: { page: page - 1, size: pageSize } })
      .then((res) => { setSubmissionsList(res.data.data || []); setTotal(res.data.total ?? 0) })
      .catch(() => { setSubmissionsList([]); setTotal(0) })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadSubmissions()
  }, [classId, assignmentId, page, pageSize])

  const handleGrade = (e) => {
    e.preventDefault()
    if (!grading) return
    const payload = { feedback: gradeForm.feedback }
    if (assignment?.rubric?.length) {
      payload.rubricScores = (gradeForm.rubricScores || assignment.rubric.map(() => 0)).map((n) => Number(n) || 0)
    } else {
      payload.score = Number(gradeForm.score)
    }
    axiosClient.put(`/classes/${classId}/assignments/${assignmentId}/submissions/${grading._id}/grade`, payload)
      .then(() => {
        ToastMessage.success('Đã chấm điểm')
        setGrading(null)
        setGradeForm({ score: '', feedback: '', rubricScores: [] })
        loadSubmissions()
      })
      .catch(ToastMessage.error)
  }

  if (loading && !assignment) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { to: '/teacher', label: 'Tổng quan' },
          { to: '/teacher/classes', label: 'Lớp của tôi' },
          { to: `/teacher/classes/${classId}`, label: 'Chi tiết lớp' },
          { label: assignment?.title || 'Bài nộp' },
        ]}
        title={assignment?.title || 'Bài tập'}
        description={assignment?.description || 'Danh sách bài nộp của học viên'}
      />

      <div className="card card-body">
        <p className="text-sm text-slate-500 mb-4">Tổng: {total} bài nộp</p>
        {submissionsList.length === 0 ? (
          <p className="text-slate-500">Chưa có bài nộp nào.</p>
        ) : (
          <>
          <ul className="space-y-4">
            {submissionsList.map((sub) => (
              <li key={sub._id} className="border border-slate-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-medium text-slate-800">{sub.studentId?.fullName}</p>
                    <p className="text-sm text-slate-500">{sub.studentId?.email}</p>
                    <p className="text-xs text-slate-400 mt-1">Nộp lúc: {new Date(sub.submittedAt).toLocaleString('vi')}</p>
                    {sub.content && <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">{sub.content}</p>}
                    {sub.score != null && <p className="mt-2 text-sm font-medium text-amber-600">Điểm: {sub.score}{assignment?.maxScore != null && `/${assignment.maxScore}`}</p>}
                    {sub.feedback && <p className="mt-1 text-sm text-slate-600">Nhận xét: {sub.feedback}</p>}
                  </div>
                  <div className="flex gap-2">
                    {grading?._id === sub._id ? (
                      <form onSubmit={handleGrade} className="flex flex-col gap-2">
                        {assignment?.rubric?.length ? (
                          <div className="space-y-1">
                            {assignment.rubric.map((r, i) => (
                              <div key={i} className="flex items-center gap-2 text-sm">
                                <span className="w-32 truncate text-slate-600">{r.name || `Tiêu chí ${i + 1}`}</span>
                                <input type="number" step="0.01" min={0} max={r.maxScore ?? 10} value={gradeForm.rubricScores?.[i] ?? ''} onChange={(e) => setGradeForm({ ...gradeForm, rubricScores: (gradeForm.rubricScores || []).map((s, j) => j === i ? e.target.value : s) })} className="border rounded-lg px-2 py-0.5 w-16" />
                                <span className="text-slate-400">/ {r.maxScore ?? 10}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <input type="number" step="0.01" min={0} max={assignment?.maxScore ?? 10} value={gradeForm.score} onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })} placeholder="Điểm" className="border rounded-lg px-3 py-1 w-20" />
                        )}
                        <textarea value={gradeForm.feedback} onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })} placeholder="Nhận xét" rows={2} className="border rounded-lg px-3 py-1 text-sm w-48" />
                        <div className="flex gap-1">
                          <button type="submit" className="btn-primary text-xs">Lưu</button>
                          <button type="button" onClick={() => { setGrading(null); setGradeForm({ score: '', feedback: '', rubricScores: [] }) }} className="btn-secondary text-xs">Hủy</button>
                        </div>
                      </form>
                    ) : (
                      <button type="button" onClick={() => { setGrading(sub); setGradeForm({ score: sub.score ?? '', feedback: sub.feedback ?? '', rubricScores: assignment?.rubric?.length ? (sub.rubricScores || assignment.rubric.map((r) => 0)) : [] }) }} className="btn-secondary text-sm">
                        {sub.score != null ? 'Sửa điểm' : 'Chấm điểm'}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
          </>
        )}
      </div>
    </div>
  )
}
