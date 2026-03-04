import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import { saveToken } from '../../store/storage'
import ToastMessage from '../../messages/ToastMessage'

const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== ''

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axiosClient.post('/auth/login', formData)
            const data = response.data
            if (data && data.accessToken) {
                const role = data.user?.role
                if (role !== 'admin' && role !== 'staff') {
                    ToastMessage.warning('Trang này dành cho Admin / Giáo vụ. Học viên và Giảng viên đăng nhập tại trang Course.')
                    return
                }
                saveToken(data.accessToken, data.refreshToken)
                if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
                navigate('/dashboard')
                ToastMessage.success('Đăng nhập thành công')
            } else {
                ToastMessage.error('Đăng nhập thất bại')
            }
        } catch (error) {
            ToastMessage.error(error)
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-slate-800 via-slate-700 to-orange-900/30">
            <div className="w-full max-w-md">
                <div className="card shadow-xl shadow-slate-900/20">
                    <div className="card-body">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-800">Đăng nhập Admin</h1>
                            <p className="text-slate-500 text-sm mt-1">Dành cho Quản trị viên & Giáo vụ</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                <input type="email" id="email" name="email" placeholder="admin@example.com" required value={formData.email} onChange={handleChange} className="w-full" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu</label>
                                <input type="password" id="password" name="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} className="w-full" />
                            </div>
                            <button type="submit" disabled={!isFormValid} className={`w-full py-3 rounded-xl font-semibold transition-all ${!isFormValid ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'btn-primary'}`}>
                                Đăng nhập
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
