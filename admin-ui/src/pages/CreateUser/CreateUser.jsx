import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'

const ROLES = [
    { value: 'teacher', label: 'Giảng viên' },
    { value: 'student', label: 'Học viên' },
    { value: 'staff', label: 'Giáo vụ' },
]

const CreateUser = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rePassword: '',
        phoneNumber: '',
        fullName: '',
        dateOfBirth: '',
        address: '',
        identityNumber: '',
        role: 'student',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const validate = () => {
        const required = ['email', 'password', 'rePassword', 'phoneNumber', 'fullName', 'dateOfBirth', 'address', 'identityNumber']
        for (const field of required) {
            if (!String(formData[field] || '').trim()) {
                ToastMessage.error(`Vui lòng nhập ${field === 'rePassword' ? 'Xác nhận mật khẩu' : field}`)
                return false
            }
        }
        if (formData.password.length < 6 || formData.password.length > 8) {
            ToastMessage.error('Mật khẩu phải từ 6-8 ký tự')
            return false
        }
        if (formData.password !== formData.rePassword) {
            ToastMessage.error('Mật khẩu và xác nhận mật khẩu không khớp')
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        try {
            await axiosClient.post('/users', {
                ...formData,
                dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
            })
            ToastMessage.success('Tạo tài khoản thành công.')
        } catch (err) {
            ToastMessage.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <PageHeader breadcrumbs={[{ to: '/dashboard', label: 'Tổng quan' }, { label: 'Tạo tài khoản' }]} title="Tạo tài khoản" description="Casestudy #1: Tạo tài khoản cho giảng viên, học viên hoặc giáo vụ. Mật khẩu 6–8 ký tự." />
            <form onSubmit={handleSubmit} className="card overflow-hidden">
                <div className="card-body space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email (*)</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5" placeholder="email@example.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Vai trò (*)</label>
                    <select name="role" required value={formData.role} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5">
                        {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu (*) — 6 đến 8 ký tự</label>
                    <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5" minLength={6} maxLength={8} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Xác nhận mật khẩu (*)</label>
                    <input type="password" name="rePassword" required value={formData.rePassword} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5" />
                </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Họ tên (*)</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Số điện thoại (*)</label>
                    <input type="text" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Ngày sinh (*)</label>
                    <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">CMND/CCCD (*)</label>
                    <input type="text" name="identityNumber" required value={formData.identityNumber} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Địa chỉ (*)</label>
                    <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5" />
                </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                    <button type="submit" disabled={loading} className="px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:opacity-50">{loading ? 'Đang tạo...' : 'Tạo tài khoản'}</button>
                    <button type="button" onClick={() => navigate('/dashboard')} className="px-5 py-2.5 border border-slate-200 font-medium rounded-xl hover:bg-slate-50 text-slate-700">Hủy</button>
                </div>
                </div>
            </form>
        </div>
    )
}

export default CreateUser
