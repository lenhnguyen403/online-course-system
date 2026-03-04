import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function CreateCourse() {
    const navigate = useNavigate()
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ courseCode: '', courseName: '', subjectId: '', durationInMonths: 6, tuitionFee: 0 })

    useEffect(() => {
        axiosClient.get('/subjects', { params: { limit: 200 } })
            .then((res) => setSubjects(res.data.data || []))
            .catch(ToastMessage.error)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.subjectId) { ToastMessage.error('Chọn môn học'); return }
        setLoading(true)
        axiosClient.post('/courses', form)
            .then((res) => {
                ToastMessage.success('Thêm khóa học thành công')
                navigate(`/dashboard/courses/${res.data._id}`)
            })
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }

    return (
        <div className="max-w-xl">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link to="/dashboard/courses">Khóa học</Link>
                <span>/</span>
                <span className="text-gray-800">Thêm mới</span>
            </div>
            <h1 className="text-xl font-bold mb-4">Thêm khóa học</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-3">
                <div><label className="block text-sm font-medium mb-1">Mã khóa học *</label><input type="text" value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} className="w-full border rounded px-3 py-2" required /></div>
                <div><label className="block text-sm font-medium mb-1">Tên khóa học *</label><input type="text" value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} className="w-full border rounded px-3 py-2" required /></div>
                <div><label className="block text-sm font-medium mb-1">Môn học *</label>
                    <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} className="w-full border rounded px-3 py-2" required>
                        <option value="">-- Chọn môn --</option>
                        {subjects.map((s) => <option key={s._id} value={s._id}>{s.subjectName}</option>)}
                    </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">Thời lượng (tháng) *</label><input type="number" min={1} value={form.durationInMonths} onChange={(e) => setForm({ ...form, durationInMonths: Number(e.target.value) })} className="w-full border rounded px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Học phí (VNĐ) *</label><input type="number" min={0} value={form.tuitionFee} onChange={(e) => setForm({ ...form, tuitionFee: Number(e.target.value) })} className="w-full border rounded px-3 py-2" /></div>
                <div className="flex gap-2 pt-2">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50">Tạo khóa học</button>
                    <Link to="/dashboard/courses" className="px-4 py-2 border rounded hover:bg-gray-50">Hủy</Link>
                </div>
            </form>
        </div>
    )
}
