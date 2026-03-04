import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function CreateClass() {
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ classCode: '', className: '', courseId: '', startDate: '', endDate: '' })

    useEffect(() => {
        axiosClient.get('/courses', { params: { limit: 200 } })
            .then((res) => setCourses(res.data.data || []))
            .catch(ToastMessage.error)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.courseId) { ToastMessage.error('Chọn khóa học'); return }
        setLoading(true)
        const body = { ...form, startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined, endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined }
        axiosClient.post('/classes', body)
            .then((res) => {
                ToastMessage.success('Tạo lớp thành công')
                navigate(`/dashboard/classes/${res.data._id}`)
            })
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }

    return (
        <div className="max-w-xl">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link to="/dashboard/classes">Lớp học</Link>
                <span>/</span>
                <span className="text-gray-800">Thêm lớp</span>
            </div>
            <h1 className="text-xl font-bold mb-4">Thêm lớp học</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-3">
                <div><label className="block text-sm font-medium mb-1">Mã lớp *</label><input type="text" value={form.classCode} onChange={(e) => setForm({ ...form, classCode: e.target.value })} className="w-full border rounded px-3 py-2" required /></div>
                <div><label className="block text-sm font-medium mb-1">Tên lớp *</label><input type="text" value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} className="w-full border rounded px-3 py-2" required /></div>
                <div><label className="block text-sm font-medium mb-1">Khóa học *</label>
                    <select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} className="w-full border rounded px-3 py-2" required>
                        <option value="">-- Chọn khóa học --</option>
                        {courses.map((c) => <option key={c._id} value={c._id}>{c.courseName} ({c.courseCode})</option>)}
                    </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">Ngày bắt đầu</label><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border rounded px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Ngày kết thúc</label><input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full border rounded px-3 py-2" /></div>
                <div className="flex gap-2 pt-2">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50">Tạo lớp</button>
                    <Link to="/dashboard/classes" className="px-4 py-2 border rounded hover:bg-gray-50">Hủy</Link>
                </div>
            </form>
        </div>
    )
}
