import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function CourseDetail() {
    const { id } = useParams()
    const [course, setCourse] = useState(null)
    const [subjects, setSubjects] = useState([])
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({ courseCode: '', courseName: '', subjectId: '', durationInMonths: 6, tuitionFee: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient.get(`/courses/${id}`)
            .then((res) => {
                setCourse(res.data)
                setForm({
                    courseCode: res.data.courseCode,
                    courseName: res.data.courseName,
                    subjectId: res.data.subjectId?._id || res.data.subjectId,
                    durationInMonths: res.data.durationInMonths ?? 6,
                    tuitionFee: res.data.tuitionFee ?? 0,
                })
            })
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
        axiosClient.get('/subjects', { params: { limit: 200 } }).then((res) => setSubjects(res.data.data || [])).catch(() => {})
    }, [id])

    const handleSave = (e) => {
        e.preventDefault()
        axiosClient.put(`/courses/${id}`, form)
            .then((res) => {
                setCourse(res.data)
                setEditing(false)
                ToastMessage.success('Cập nhật thành công')
            })
            .catch(ToastMessage.error)
    }

    if (loading || !course) return <div className="p-4">Đang tải...</div>

    return (
        <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link to="/dashboard/courses">Khóa học</Link>
                <span>/</span>
                <span className="text-gray-800">{course.courseName}</span>
            </div>
            <h1 className="text-xl font-bold mb-4">Chi tiết khóa học</h1>
            <div className="bg-white rounded shadow p-6">
                {!editing ? (
                    <>
                        <dl className="grid gap-3 text-sm">
                            <div><dt className="text-gray-500">Mã khóa</dt><dd>{course.courseCode}</dd></div>
                            <div><dt className="text-gray-500">Tên khóa học</dt><dd>{course.courseName}</dd></div>
                            <div><dt className="text-gray-500">Môn học</dt><dd>{course.subjectId?.subjectName || '-'}</dd></div>
                            <div><dt className="text-gray-500">Thời lượng</dt><dd>{course.durationInMonths} tháng</dd></div>
                            <div><dt className="text-gray-500">Học phí</dt><dd>{course.tuitionFee != null ? course.tuitionFee.toLocaleString() : '-'} VNĐ</dd></div>
                        </dl>
                        <div className="mt-6 flex gap-2">
                            <button type="button" onClick={() => setEditing(true)} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Chỉnh sửa</button>
                            <Link to={`/dashboard/courses/${id}/content`} className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600">Nội dung khóa học</Link>
                            <Link to="/dashboard/courses" className="px-4 py-2 border rounded hover:bg-gray-50">Quay lại</Link>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSave} className="space-y-3">
                        <div><label className="block text-sm text-gray-500">Mã khóa</label><input type="text" value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} className="w-full border rounded px-3 py-2" required /></div>
                        <div><label className="block text-sm text-gray-500">Tên khóa học</label><input type="text" value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} className="w-full border rounded px-3 py-2" required /></div>
                        <div><label className="block text-sm text-gray-500">Môn học</label>
                            <select value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} className="w-full border rounded px-3 py-2">
                                {subjects.map((s) => <option key={s._id} value={s._id}>{s.subjectName}</option>)}
                            </select>
                        </div>
                        <div><label className="block text-sm text-gray-500">Thời lượng (tháng)</label><input type="number" min={1} value={form.durationInMonths} onChange={(e) => setForm({ ...form, durationInMonths: Number(e.target.value) })} className="w-full border rounded px-3 py-2" /></div>
                        <div><label className="block text-sm text-gray-500">Học phí (VNĐ)</label><input type="number" min={0} value={form.tuitionFee} onChange={(e) => setForm({ ...form, tuitionFee: Number(e.target.value) })} className="w-full border rounded px-3 py-2" /></div>
                        <div className="flex gap-2 pt-2">
                            <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded">Lưu</button>
                            <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 border rounded">Hủy</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
