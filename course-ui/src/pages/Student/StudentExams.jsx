import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function StudentExams() {
    const [user, setUser] = useState(null)
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user') || '{}')
        if (!u.id) {
            setLoading(false)
            return
        }
        setUser(u)
        axiosClient.get(`/exams/students/${u.id}/results`, { params: { limit: 50 } })
            .then((res) => setList(res.data.data || []))
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="p-4">Đang tải...</div>

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Điểm các bài kiểm tra</h1>
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="text-left p-2">Bài thi / Lớp</th>
                            <th className="text-right p-2">Lý thuyết</th>
                            <th className="text-right p-2">Thực hành</th>
                            <th className="text-right p-2">Trung bình</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((r) => (
                            <tr key={r._id} className="border-b">
                                <td className="p-2">{r.examId?.title || '-'} {r.examId?.classId ? `(${r.examId.classId.className || ''})` : ''}</td>
                                <td className="p-2 text-right">{r.theoryScore}</td>
                                <td className="p-2 text-right">{r.practiceScore}</td>
                                <td className="p-2 text-right font-medium">{r.averageScore != null ? Number(r.averageScore).toFixed(2) : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {list.length === 0 && <p className="text-gray-500 mt-2">Chưa có điểm.</p>}
        </div>
    )
}
