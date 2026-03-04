import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

const STATUS_LABEL = { active: 'Đang học', suspended: 'Đình chỉ', 'transfer pending': 'Chờ chuyển lớp', dropped: 'Thôi học' }

export default function TeacherClassDetail() {
    const { classId } = useParams()
    const [classInfo, setClassInfo] = useState(null)
    const [students, setStudents] = useState([])
    const [total, setTotal] = useState(0)
    const [statusFilter, setStatusFilter] = useState('')
    const [journalContent, setJournalContent] = useState('')
    const [loading, setLoading] = useState(true)

    const loadClass = () => {
        axiosClient.get(`/classes/${classId}`)
            .then((res) => setClassInfo(res.data))
            .catch(ToastMessage.error)
    }

    const loadStudents = () => {
        const params = statusFilter ? { status: statusFilter, limit: 100 } : { limit: 100 }
        axiosClient.get(`/classes/${classId}/students`, { params })
            .then((res) => {
                setStudents(res.data.data || [])
                setTotal(res.data.total ?? 0)
            })
            .catch(ToastMessage.error)
    }

    useEffect(() => {
        loadClass()
    }, [classId])

    useEffect(() => {
        if (classId) loadStudents()
    }, [classId, statusFilter])

    useEffect(() => { setLoading(false) }, [classInfo])

    const handleSubmitJournal = (e) => {
        e.preventDefault()
        if (!journalContent.trim()) return
        axiosClient.post(`/journals/classes/${classId}/journals`, { content: journalContent })
            .then(() => {
                ToastMessage.success('Đã lưu nhật ký lớp')
                setJournalContent('')
            })
            .catch(ToastMessage.error)
    }

    if (!classInfo) return <div className="p-4">Đang tải...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link to="/teacher">Lớp học</Link>
                <span>/</span>
                <span className="text-gray-800">{classInfo.className}</span>
            </div>
            <h1 className="text-xl font-bold">{classInfo.className}</h1>

            <section className="bg-white p-4 rounded shadow">
                <h2 className="font-bold mb-2">Nhật ký lớp (hằng ngày)</h2>
                <form onSubmit={handleSubmitJournal} className="flex gap-2">
                    <textarea value={journalContent} onChange={(e) => setJournalContent(e.target.value)}
                        className="flex-1 border rounded px-3 py-2" rows={2} placeholder="Nội dung nhật ký..." required />
                    <button type="submit" className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-rose-600">Ghi nhật ký</button>
                </form>
            </section>

            <section>
                <h2 className="font-bold mb-2">Danh sách học viên (tổng: {total})</h2>
                <div className="mb-2">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-3 py-2 text-sm">
                        <option value="">Tất cả trạng thái</option>
                        {Object.entries(STATUS_LABEL).map(([v, l]) => (
                            <option key={v} value={v}>{l}</option>
                        ))}
                    </select>
                </div>
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left p-2">Họ tên</th>
                                <th className="text-left p-2">Email</th>
                                <th className="text-left p-2">SĐT</th>
                                <th className="text-left p-2">Trạng thái</th>
                                <th className="p-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((en) => (
                                <tr key={en._id} className="border-b">
                                    <td className="p-2">{en.studentId?.fullName}</td>
                                    <td className="p-2">{en.studentId?.email}</td>
                                    <td className="p-2">{en.studentId?.phoneNumber}</td>
                                    <td className="p-2">{STATUS_LABEL[en.status] || en.status}</td>
                                    <td className="p-2">
                                        <Link to={`/teacher/classes/${classId}/students/${en.studentId?._id}`}
                                            className="text-rose-600 hover:underline">Chi tiết / Nhật ký HV</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
