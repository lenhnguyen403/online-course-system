import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function CreatePayment() {
    const navigate = useNavigate()
    const [students, setStudents] = useState([])
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ studentId: '', classId: '', amount: 0, dueDate: '' })

    useEffect(() => {
        axiosClient.get('/users', { params: { role: 'student', limit: 200 } }).then((res) => setStudents(res.data.data || [])).catch(() => {})
        axiosClient.get('/classes', { params: { limit: 200 } }).then((res) => setClasses(res.data.data || [])).catch(() => {})
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.studentId || !form.classId) { ToastMessage.error('Chọn học viên và lớp'); return }
        setLoading(true)
        axiosClient.post(`/payments/students/${form.studentId}/payments`, { classId: form.classId, amount: form.amount, dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : new Date().toISOString() })
            .then(() => {
                ToastMessage.success('Tạo đợt thu thành công')
                navigate('/dashboard/payments')
            })
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }

    return (
        <div className="max-w-xl">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link to="/dashboard/payments">Học phí</Link>
                <span>/</span>
                <span className="text-gray-800">Tạo đợt thu</span>
            </div>
            <h1 className="text-xl font-bold mb-4">Tạo đợt thu học phí</h1>
            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-3">
                <div><label className="block text-sm font-medium mb-1">Học viên *</label>
                    <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} className="w-full border rounded px-3 py-2" required>
                        <option value="">-- Chọn học viên --</option>
                        {students.map((u) => <option key={u._id} value={u._id}>{u.fullName} ({u.email})</option>)}
                    </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">Lớp *</label>
                    <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} className="w-full border rounded px-3 py-2" required>
                        <option value="">-- Chọn lớp --</option>
                        {classes.map((c) => <option key={c._id} value={c._id}>{c.className}</option>)}
                    </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">Số tiền (VNĐ) *</label><input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="w-full border rounded px-3 py-2" required /></div>
                <div><label className="block text-sm font-medium mb-1">Hạn nộp *</label><input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full border rounded px-3 py-2" required /></div>
                <div className="flex gap-2 pt-2">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50">Tạo</button>
                    <Link to="/dashboard/payments" className="px-4 py-2 border rounded hover:bg-gray-50">Hủy</Link>
                </div>
            </form>
        </div>
    )
}
