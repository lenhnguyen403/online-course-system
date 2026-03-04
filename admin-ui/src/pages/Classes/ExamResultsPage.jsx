import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function ExamResultsPage() {
    const { classId, examId } = useParams()
    const [exam, setExam] = useState(null)
    const [students, setStudents] = useState([])
    const [results, setResults] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient.get(`/exams/exams/${examId}`).then((res) => setExam(res.data)).catch(ToastMessage.error)
        axiosClient.get(`/classes/${classId}/students`, { params: { limit: 200 } })
            .then((res) => {
                const list = res.data.data || []
                setStudents(list)
                const map = {}
                list.forEach((en) => { map[en.studentId?._id] = { theoryScore: '', practiceScore: '' } })
                setResults(map)
            })
            .catch(ToastMessage.error)
        axiosClient.get(`/exams/exams/${examId}/results`, { params: { limit: 200 } })
            .then((res) => {
                const list = res.data.data || []
                const map = {}
                list.forEach((r) => { map[r.studentId?._id] = { theoryScore: r.theoryScore, practiceScore: r.practiceScore } })
                setResults((prev) => ({ ...prev, ...map }))
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [classId, examId])

    const handleSave = (studentId) => {
        const r = results[studentId]
        if (r.theoryScore === '' || r.practiceScore === '') { ToastMessage.error('Nhập đủ điểm lý thuyết và thực hành'); return }
        const theory = Number(r.theoryScore)
        const practice = Number(r.practiceScore)
        if (theory < 0 || theory > 10 || practice < 0 || practice > 10) { ToastMessage.error('Điểm từ 0-10'); return }
        axiosClient.post(`/exams/exams/${examId}/results`, { studentId, theoryScore: theory, practiceScore: practice })
            .then(() => ToastMessage.success('Đã lưu điểm'))
            .catch((err) => {
                if (err.response?.status === 400 || err.response?.data?.message?.includes('already')) {
                    axiosClient.put(`/exams/exams/${examId}/results/${studentId}`, { theoryScore: theory, practiceScore: practice })
                        .then(() => ToastMessage.success('Đã cập nhật điểm'))
                        .catch(ToastMessage.error)
                } else ToastMessage.error(err)
            })
    }

    const handleBulkSave = () => {
        const bulk = students.map((en) => {
            const r = results[en.studentId?._id] || {}
            const theory = Number(r.theoryScore)
            const practice = Number(r.practiceScore)
            return { studentId: en.studentId?._id, theoryScore: (theory >= 0 && theory <= 10) ? theory : 0, practiceScore: (practice >= 0 && practice <= 10) ? practice : 0 }
        })
        axiosClient.post(`/exams/exams/${examId}/results/bulk`, { results: bulk })
            .then(() => ToastMessage.success('Đã lưu tất cả điểm'))
            .catch(ToastMessage.error)
    }

    if (loading || !exam) return <div className="p-4">Đang tải...</div>

    return (
        <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link to="/dashboard/classes">Lớp học</Link>
                <span>/</span>
                <Link to={`/dashboard/classes/${classId}`}>Chi tiết lớp</Link>
                <span>/</span>
                <span className="text-gray-800">Điểm: {exam.title}</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
                <h1 className="text-xl font-bold">Nhập điểm: {exam.title}</h1>
                {exam.examType === 'quiz' && (
                    <Link to={`/dashboard/classes/${classId}/exams/${examId}/questions`} className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 text-sm">Quản lý câu hỏi quiz</Link>
                )}
            </div>
            <div className="mb-4">
                <button type="button" onClick={handleBulkSave} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Lưu tất cả điểm</button>
            </div>
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="text-left p-2">Học viên</th>
                            <th className="text-right p-2 w-24">Lý thuyết (0-10)</th>
                            <th className="text-right p-24 w-24">Thực hành (0-10)</th>
                            <th className="text-right p-2 w-24">TB</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((en) => {
                            const r = results[en.studentId?._id] || {}
                            const theory = Number(r.theoryScore)
                            const practice = Number(r.practiceScore)
                            const avg = (theory >= 0 && practice >= 0) ? ((theory + practice) / 2).toFixed(2) : '-'
                            return (
                                <tr key={en._id} className="border-b">
                                    <td className="p-2">{en.studentId?.fullName}</td>
                                    <td className="p-2"><input type="number" min={0} max={10} step={0.5} value={r.theoryScore} onChange={(e) => setResults({ ...results, [en.studentId._id]: { ...r, theoryScore: e.target.value } })} className="w-full border rounded px-2 py-1 text-right" /></td>
                                    <td className="p-2"><input type="number" min={0} max={10} step={0.5} value={r.practiceScore} onChange={(e) => setResults({ ...results, [en.studentId._id]: { ...r, practiceScore: e.target.value } })} className="w-full border rounded px-2 py-1 text-right" /></td>
                                    <td className="p-2 text-right">{avg}</td>
                                    <td className="p-2"><button type="button" onClick={() => handleSave(en.studentId?._id)} className="text-orange-600 text-xs">Lưu</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
