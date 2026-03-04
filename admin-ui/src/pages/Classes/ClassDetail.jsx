import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'

const ENROLL_LABEL = { active: 'Đang học', suspended: 'Đình chỉ', 'transfer pending': 'Chờ chuyển lớp', dropped: 'Thôi học' }
const ENROLL_BADGE = { active: 'success', suspended: 'warning', 'transfer pending': 'info', dropped: 'danger' }
const EXAM_TYPE_LABEL = { midterm: 'Giữa kỳ', final: 'Cuối kỳ', quiz: 'Quiz' }
const TABS = ['Thông tin', 'Học viên', 'Giảng viên', 'Nhật ký', 'Bài thi', 'Điểm']

export default function ClassDetail() {
    const { id } = useParams()
    const [tab, setTab] = useState(0)
    const [classInfo, setClassInfo] = useState(null)
    const [students, setStudents] = useState([])
    const [teachers, setTeachers] = useState([])
    const [journals, setJournals] = useState([])
    const [exams, setExams] = useState([])
    const [courses, setCourses] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [addStudentId, setAddStudentId] = useState('')
    const [addTeacherId, setAddTeacherId] = useState('')
    const [statusEdit, setStatusEdit] = useState({})

    const loadClass = () => axiosClient.get(`/classes/${id}`).then((res) => setClassInfo(res.data)).catch(ToastMessage.error)
    const loadStudents = () => axiosClient.get(`/classes/${id}/students`, { params: { limit: 100 } }).then((res) => setStudents(res.data.data || [])).catch(ToastMessage.error)
    const loadTeachers = () => axiosClient.get(`/classes/${id}/teachers`).then((res) => setTeachers(Array.isArray(res.data) ? res.data : [])).catch(ToastMessage.error)
    const loadJournals = () => axiosClient.get(`/journals/classes/${id}/journals`, { params: { limit: 50 } }).then((res) => setJournals(res.data.data || [])).catch(ToastMessage.error)
    const loadExams = () => axiosClient.get(`/exams/classes/${id}/exams`).then((res) => setExams(res.data || [])).catch(ToastMessage.error)

    useEffect(() => {
        setLoading(true)
        loadClass().finally(() => setLoading(false))
    }, [id])

    useEffect(() => {
        if (!id) return
        if (tab === 1) loadStudents()
        if (tab === 2) loadTeachers()
        if (tab === 3) loadJournals()
        if (tab === 4) loadExams()
    }, [id, tab])

    useEffect(() => {
        axiosClient.get('/courses', { params: { limit: 200 } }).then((res) => setCourses(res.data.data || [])).catch(() => {})
        axiosClient.get('/users', { params: { limit: 200 } }).then((res) => setUsers(res.data.data || [])).catch(() => {})
    }, [])

    const studentsOption = users.filter((u) => u.role === 'student').filter((u) => !students.some((s) => s.studentId?._id === u._id))
    const teachersOption = users.filter((u) => u.role === 'teacher').filter((u) => !teachers.some((t) => t._id === u._id))

    const handleAddStudent = () => {
        if (!addStudentId) return
        axiosClient.post(`/classes/${id}/students`, { studentId: addStudentId })
            .then(() => { setAddStudentId(''); loadStudents(); ToastMessage.success('Đã thêm học viên') })
            .catch(ToastMessage.error)
    }

    const handleAddTeacher = () => {
        if (!addTeacherId) return
        axiosClient.post(`/classes/${id}/teachers`, { teacherId: addTeacherId })
            .then(() => { setAddTeacherId(''); loadTeachers(); loadClass(); ToastMessage.success('Đã thêm giảng viên') })
            .catch(ToastMessage.error)
    }

    const handleUpdateStatus = (studentId, status) => {
        axiosClient.patch(`/classes/${id}/students/${studentId}/status`, { status })
            .then(() => { loadStudents(); setStatusEdit({}); ToastMessage.success('Đã cập nhật trạng thái') })
            .catch(ToastMessage.error)
    }

    const handleRemoveStudent = (studentId) => {
        if (!window.confirm('Xóa học viên khỏi lớp?')) return
        axiosClient.delete(`/classes/${id}/students/${studentId}`)
            .then(() => { loadStudents(); ToastMessage.success('Đã xóa') })
            .catch(ToastMessage.error)
    }

    const handleRemoveTeacher = (teacherId) => {
        if (!window.confirm('Xóa giảng viên khỏi lớp?')) return
        axiosClient.delete(`/classes/${id}/teachers/${teacherId}`)
            .then(() => { loadTeachers(); loadClass(); ToastMessage.success('Đã xóa') })
            .catch(ToastMessage.error)
    }

    if (loading || !classInfo) return <div className="p-4">Đang tải...</div>

    return (
        <div className="space-y-6">
            <PageHeader breadcrumbs={[{ to: '/dashboard', label: 'Tổng quan' }, { to: '/dashboard/classes', label: 'Lớp học' }, { label: classInfo.className }]} title={classInfo.className} description={classInfo.classCode} />
            <div className="border-b border-slate-200 flex gap-1 overflow-x-auto">
                {TABS.map((t, i) => (
                    <button key={t} type="button" onClick={() => setTab(i)} className={`px-4 py-3 font-medium rounded-t-xl border-b-2 -mb-px whitespace-nowrap transition-colors ${tab === i ? 'border-orange-500 text-orange-600 bg-orange-50/50' : 'border-transparent text-slate-600 hover:bg-slate-50'}`}>{t}</button>
                ))}
            </div>

            {tab === 0 && (
                <div className="bg-white rounded shadow p-6">
                    <dl className="grid gap-2 text-sm">
                        <div><dt className="text-gray-500">Mã lớp</dt><dd>{classInfo.classCode}</dd></div>
                        <div><dt className="text-gray-500">Khóa học</dt><dd>{classInfo.courseId?.courseName || '-'}</dd></div>
                        <div><dt className="text-gray-500">Trạng thái</dt><dd>{classInfo.status || '-'}</dd></div>
                        <div><dt className="text-gray-500">Ngày bắt đầu</dt><dd>{classInfo.startDate ? new Date(classInfo.startDate).toLocaleDateString('vi-VN') : '-'}</dd></div>
                        <div><dt className="text-gray-500">Ngày kết thúc</dt><dd>{classInfo.endDate ? new Date(classInfo.endDate).toLocaleDateString('vi-VN') : '-'}</dd></div>
                    </dl>
                </div>
            )}

            {tab === 1 && (
                <div className="bg-white rounded shadow p-6">
                    <div className="flex gap-2 mb-4">
                        <select value={addStudentId} onChange={(e) => setAddStudentId(e.target.value)} className="border rounded px-3 py-2 text-sm">
                            <option value="">-- Chọn học viên --</option>
                            {studentsOption.map((u) => <option key={u._id} value={u._id}>{u.fullName} ({u.email})</option>)}
                        </select>
                        <button type="button" onClick={handleAddStudent} className="px-4 py-2 bg-orange-500 text-white rounded text-sm">Thêm HV</button>
                    </div>
                    <table className="w-full text-sm">
                        <thead><tr className="border-b bg-gray-50"><th className="text-left p-2">Họ tên</th><th className="text-left p-2">Email</th><th className="text-left p-2">Trạng thái</th><th className="p-2"></th></tr></thead>
                        <tbody>
                            {students.map((en) => (
                                <tr key={en._id} className="border-b">
                                    <td className="p-2">{en.studentId?.fullName}</td>
                                    <td className="p-2">{en.studentId?.email}</td>
                                    <td className="p-2">
                                        {statusEdit[en.studentId?._id] !== undefined ? (
                                            <select value={statusEdit[en.studentId._id]} onChange={(e) => setStatusEdit({ ...statusEdit, [en.studentId._id]: e.target.value })} className="border rounded px-2 py-1 text-xs">
                                                {Object.entries(ENROLL_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                                            </select>
                                        ) : (
                                            <Badge variant={ENROLL_BADGE[en.status] || 'neutral'}>{ENROLL_LABEL[en.status] || en.status}</Badge>
                                        )}
                                        {statusEdit[en.studentId?._id] !== undefined ? (
                                            <button type="button" onClick={() => handleUpdateStatus(en.studentId._id, statusEdit[en.studentId._id])} className="ml-2 text-orange-600 text-xs">Lưu</button>
                                        ) : (
                                            <button type="button" onClick={() => setStatusEdit({ ...statusEdit, [en.studentId?._id]: en.status })} className="ml-2 text-orange-600 text-xs">Sửa</button>
                                        )}
                                    </td>
                                    <td className="p-2"><button type="button" onClick={() => handleRemoveStudent(en.studentId?._id)} className="text-red-600 text-xs">Xóa</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === 2 && (
                <div className="bg-white rounded shadow p-6">
                    <div className="flex gap-2 mb-4">
                        <select value={addTeacherId} onChange={(e) => setAddTeacherId(e.target.value)} className="border rounded px-3 py-2 text-sm">
                            <option value="">-- Chọn giảng viên --</option>
                            {teachersOption.map((u) => <option key={u._id} value={u._id}>{u.fullName}</option>)}
                        </select>
                        <button type="button" onClick={handleAddTeacher} className="px-4 py-2 bg-orange-500 text-white rounded text-sm">Thêm GV</button>
                    </div>
                    <table className="w-full text-sm">
                        <thead><tr className="border-b bg-gray-50"><th className="text-left p-2">Họ tên</th><th className="text-left p-2">Email</th><th className="p-2"></th></tr></thead>
                        <tbody>
                            {teachers.map((t) => (
                                <tr key={t._id} className="border-b">
                                    <td className="p-2">{t.fullName}</td>
                                    <td className="p-2">{t.email}</td>
                                    <td className="p-2"><button type="button" onClick={() => handleRemoveTeacher(t._id)} className="text-red-600 text-xs">Xóa</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {tab === 3 && (
                <div className="bg-white rounded shadow p-6">
                    <p className="text-sm text-gray-500 mb-2">Nhật ký lớp (ghi bởi GV tại trang Course)</p>
                    <ul className="space-y-2">
                        {journals.map((j) => (
                            <li key={j._id} className="border-b pb-2 text-sm">
                                <span className="text-gray-500">{new Date(j.createdAt).toLocaleString('vi-VN')}</span> · {j.teacherId?.fullName}: {j.content}
                            </li>
                        ))}
                        {journals.length === 0 && <li className="text-gray-400">Chưa có nhật ký.</li>}
                    </ul>
                </div>
            )}

            {tab === 4 && (
                <div className="bg-white rounded shadow p-6">
                    <p className="text-sm text-gray-500 mb-4">Danh sách bài thi. Nhập điểm tại tab Điểm.</p>
                    <table className="w-full text-sm">
                        <thead><tr className="border-b bg-gray-50"><th className="text-left p-2">Tên bài thi</th><th className="text-left p-2">Loại</th><th className="text-left p-2">Ngày thi</th><th className="p-2"></th></tr></thead>
                        <tbody>
                            {exams.map((e) => (
                                <tr key={e._id} className="border-b">
                                    <td className="p-2">{e.title}</td>
                                    <td className="p-2">{EXAM_TYPE_LABEL[e.examType] || e.examType}</td>
                                    <td className="p-2">{e.examDate ? new Date(e.examDate).toLocaleDateString('vi-VN') : '-'}</td>
                                    <td className="p-2"><Link to={`/dashboard/classes/${id}/exams/${e._id}/results`} className="text-orange-600 hover:underline">Nhập điểm</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {exams.length === 0 && <p className="text-gray-400 py-2">Chưa có bài thi. Tạo bài thi tại trang Course hoặc thêm API tạo bài thi từ Admin.</p>}
                </div>
            )}

            {tab === 5 && (
                <div className="bg-white rounded shadow p-6">
                    <p className="text-sm text-gray-500 mb-4">Chọn bài thi ở tab Bài thi để nhập điểm từng đợt thi.</p>
                    <p className="text-gray-400">Vào tab Bài thi → Nhập điểm (link đến trang nhập điểm theo exam).</p>
                </div>
            )}
        </div>
    )
}
