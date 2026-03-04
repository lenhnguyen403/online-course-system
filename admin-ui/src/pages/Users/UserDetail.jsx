import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

const ROLE_LABEL = { admin: 'Admin', staff: 'Giáo vụ', teacher: 'Giảng viên', student: 'Học viên' }

export default function UserDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState({ fullName: '', phoneNumber: '', dateOfBirth: '', address: '', identityNumber: '', role: '' })

    useEffect(() => {
        axiosClient.get(`/users/${id}`)
            .then((res) => {
                setUser(res.data)
                setForm({
                    fullName: res.data.fullName || '',
                    phoneNumber: res.data.phoneNumber || '',
                    dateOfBirth: res.data.dateOfBirth ? res.data.dateOfBirth.slice(0, 10) : '',
                    address: res.data.address || '',
                    identityNumber: res.data.identityNumber || '',
                    role: res.data.role || '',
                })
            })
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }, [id])

    const handleSave = (e) => {
        e.preventDefault()
        axiosClient.put(`/users/${id}`, { ...form, dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : undefined })
            .then((res) => {
                setUser(res.data)
                setEditing(false)
                ToastMessage.success('Cập nhật thành công')
            })
            .catch(ToastMessage.error)
    }

    const handleSendCredentials = () => {
        axiosClient.post(`/users/${id}/send-credentials`)
            .then(() => ToastMessage.success('Đã gửi email thông tin đăng nhập'))
            .catch(ToastMessage.error)
    }

    if (loading || !user) return <div className="p-4">Đang tải...</div>

    return (
        <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link to="/dashboard/users">Người dùng</Link>
                <span>/</span>
                <span className="text-gray-800">{user.fullName}</span>
            </div>
            <h1 className="text-xl font-bold mb-4">Chi tiết người dùng</h1>
            <div className="bg-white rounded shadow p-6">
                {!editing ? (
                    <>
                        <dl className="grid gap-3 text-sm">
                            <div><dt className="text-gray-500">Họ tên</dt><dd>{user.fullName}</dd></div>
                            <div><dt className="text-gray-500">Email</dt><dd>{user.email}</dd></div>
                            <div><dt className="text-gray-500">Số điện thoại</dt><dd>{user.phoneNumber}</dd></div>
                            <div><dt className="text-gray-500">Ngày sinh</dt><dd>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : '-'}</dd></div>
                            <div><dt className="text-gray-500">Địa chỉ</dt><dd>{user.address || '-'}</dd></div>
                            <div><dt className="text-gray-500">CMND/CCCD</dt><dd>{user.identityNumber || '-'}</dd></div>
                            <div><dt className="text-gray-500">Vai trò</dt><dd>{ROLE_LABEL[user.role] || user.role}</dd></div>
                        </dl>
                        <div className="mt-6 flex gap-2">
                            <button type="button" onClick={() => setEditing(true)} className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Chỉnh sửa</button>
                            <button type="button" onClick={handleSendCredentials} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">Gửi email đăng nhập</button>
                            <Link to="/dashboard/users" className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 inline-block">Quay lại</Link>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSave} className="space-y-3">
                        <div><label className="block text-sm text-gray-500">Họ tên</label><input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full border rounded px-3 py-2" required /></div>
                        <div><label className="block text-sm text-gray-500">Số điện thoại</label><input type="text" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className="w-full border rounded px-3 py-2" /></div>
                        <div><label className="block text-sm text-gray-500">Ngày sinh</label><input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="w-full border rounded px-3 py-2" /></div>
                        <div><label className="block text-sm text-gray-500">Địa chỉ</label><input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border rounded px-3 py-2" /></div>
                        <div><label className="block text-sm text-gray-500">CMND/CCCD</label><input type="text" value={form.identityNumber} onChange={(e) => setForm({ ...form, identityNumber: e.target.value })} className="w-full border rounded px-3 py-2" /></div>
                        <div><label className="block text-sm text-gray-500">Vai trò</label>
                            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border rounded px-3 py-2">
                                {Object.entries(ROLE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Lưu</button>
                            <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 border rounded">Hủy</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
