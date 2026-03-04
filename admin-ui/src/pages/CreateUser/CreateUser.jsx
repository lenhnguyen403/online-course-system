import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

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
            ToastMessage.success('Tạo tài khoản thành công. Chuyển sang trang Đăng nhập.')
            navigate('/')
        } catch (err) {
            ToastMessage.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Tạo tài khoản</h1>
            <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
                <div>
                    <label className="block text-sm font-medium mb-1">Email (*)</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2" placeholder="email@example.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Mật khẩu (*) - 6 đến 8 ký tự</label>
                    <input type="password" name="password" required value={formData.password} onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2" minLength={6} maxLength={8} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu (*)</label>
                    <input type="password" name="rePassword" required value={formData.rePassword} onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Số điện thoại (*)</label>
                    <input type="text" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Họ tên (*)</label>
                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Ngày sinh (*)</label>
                    <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Địa chỉ (*)</label>
                    <input type="text" name="address" required value={formData.address} onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">CMND/CCCD (*)</label>
                    <input type="text" name="identityNumber" required value={formData.identityNumber} onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Vai trò (*)</label>
                    <select name="role" required value={formData.role} onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2">
                        {ROLES.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2 pt-2">
                    <button type="submit" disabled={loading}
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50">
                        {loading ? 'Đang tạo...' : 'Tạo tài khoản'}
                    </button>
                    <button type="button" onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateUser
