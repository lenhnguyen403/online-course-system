import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

const STATUS_LABEL = { active: 'Đang học', suspended: 'Đình chỉ', 'transfer pending': 'Chờ chuyển lớp', dropped: 'Thôi học' }

export default function TeacherStudentDetail() {
    const { classId, studentId } = useParams()
    const [enrollment, setEnrollment] = useState(null)
    const [journalContent, setJournalContent] = useState('')
    const [journals, setJournals] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient.get(`/classes/${classId}/students/${studentId}`)
            .then((res) => setEnrollment(res.data))
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }, [classId, studentId])

    useEffect(() => {
        if (studentId) {
            axiosClient.get(`/journals/students/${studentId}/journals`, { params: { limit: 20 } })
                .then((res) => setJournals(res.data.data || []))
                .catch(() => {})
        }
    }, [studentId])

    const handleSubmitJournal = (e) => {
        e.preventDefault()
        if (!journalContent.trim()) return
        axiosClient.post(`/journals/students/${studentId}/journals`, { content: journalContent })
            .then(() => {
                ToastMessage.success('Đã lưu nhật ký học viên')
                setJournalContent('')
                return axiosClient.get(`/journals/students/${studentId}/journals`, { params: { limit: 20 } })
            })
            .then((res) => setJournals(res.data.data || []))
            .catch(ToastMessage.error)
    }

    if (loading || !enrollment) return <div className="p-4">Đang tải...</div>

    const s = enrollment.studentId

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link to="/teacher">Lớp học</Link>
                <span>/</span>
                <Link to={`/teacher/classes/${classId}`}>Lớp</Link>
                <span>/</span>
                <span className="text-gray-800">{s?.fullName}</span>
            </div>
            <h1 className="text-xl font-bold">Chi tiết học viên</h1>
            <div className="bg-white p-4 rounded shadow grid gap-2 text-sm">
                <div><span className="text-gray-500">Mã HV:</span> {s?._id}</div>
                <div><span className="text-gray-500">Họ tên:</span> {s?.fullName}</div>
                <div><span className="text-gray-500">Email:</span> {s?.email}</div>
                <div><span className="text-gray-500">Ngày sinh:</span> {s?.dateOfBirth ? new Date(s.dateOfBirth).toLocaleDateString('vi-VN') : '-'}</div>
                <div><span className="text-gray-500">Địa chỉ:</span> {s?.address || '-'}</div>
                <div><span className="text-gray-500">SĐT:</span> {s?.phoneNumber}</div>
                <div><span className="text-gray-500">Trạng thái:</span> {STATUS_LABEL[enrollment.status] || enrollment.status}</div>
            </div>
            <section className="bg-white p-4 rounded shadow">
                <h2 className="font-bold mb-2">Nhật ký học viên</h2>
                <form onSubmit={handleSubmitJournal} className="flex gap-2 mb-4">
                    <textarea value={journalContent} onChange={(e) => setJournalContent(e.target.value)}
                        className="flex-1 border rounded px-3 py-2" rows={2} placeholder="Nội dung nhật ký..." required />
                    <button type="submit" className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600">Ghi nhật ký</button>
                </form>
                <div className="text-sm text-gray-500">Lịch sử nhật ký:</div>
                <ul className="mt-2 space-y-1">
                    {journals.map((j) => (
                        <li key={j._id} className="border-b py-2 text-sm">
                            <span className="text-gray-500">{new Date(j.createdAt).toLocaleString('vi-VN')}</span> · {j.content}
                        </li>
                    ))}
                    {journals.length === 0 && <li className="text-gray-400">Chưa có nhật ký.</li>}
                </ul>
            </section>
        </div>
    )
}
