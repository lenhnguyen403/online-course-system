import './Login.css'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import { saveToken } from '../../store/storage'
import ToastMessage from '../../messages/ToastMessage'
import { Link } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    // const [error, setError] = useState('')
    const location = useLocation()
    const isTeacher = location.pathname.includes('/teacher')

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== ''

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()  // Ngăn chặn hành vi mặc định của form (tải lại trang)

        try {
            const response = await axiosClient.post(`/auth/login`, formData)

            // console.log(response.data);
            const data = response.data

            // Lưu token vào localStorage
            if (data && data.accessToken) {

                // Kiem tra dang nhap theo role (teacher, student)
                const role = data.user.role;

                if (isTeacher && role !== 'teacher') {
                    ToastMessage.warning('This page is only for Teacher')
                    return
                }

                if (!isTeacher && role !== 'student') {
                    ToastMessage.warning('This page is only for Student')
                    return
                }

                saveToken(data.accessToken, data.refreshToken)
                if (data.user) localStorage.setItem('user', JSON.stringify(data.user))

                navigate(role === 'teacher' ? '/teacher' : '/student')
                ToastMessage.success('Login Successfully')

            } else {
                ToastMessage.error('Login Failed')
                console.error('Tokens not found in response.');
            }


        } catch (error) {
            ToastMessage.error(error)
            console.error('Error occurred:', error);
        }
    }


    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${isTeacher ? 'bg-gradient-to-br from-rose-50 via-white to-rose-50' : 'bg-gradient-to-br from-slate-50 via-white to-cyan-50'}`}>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" aria-hidden />
            <div className="relative w-full max-w-md">
                <div className="card shadow-xl shadow-slate-200/50">
                    <div className="card-body">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-slate-800">{isTeacher ? 'Đăng nhập Giảng viên' : 'Đăng nhập Học viên'}</h1>
                            <p className="text-slate-500 text-sm mt-1">Email và mật khẩu do trung tâm cấp</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                <input type="email" id="email" name="email" placeholder="your@email.com" required value={formData.email} onChange={handleChange} className="w-full" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Mật khẩu</label>
                                <input type="password" id="password" name="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} className="w-full" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <label className="inline-flex items-center gap-2 text-slate-600 cursor-pointer"><input type="checkbox" className="rounded border-slate-300 text-orange-500 focus:ring-orange-500" /> Ghi nhớ</label>
                                <Link to="/" className={`font-medium ${isTeacher ? 'text-rose-600 hover:text-rose-700' : 'text-cyan-600 hover:text-cyan-700'}`}>Quên mật khẩu?</Link>
                            </div>
                            <button type="submit" disabled={!isFormValid} className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center ${!isFormValid ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : isTeacher ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25' : 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/25'}`}>
                                Đăng nhập
                            </button>
                        </form>
                        <p className="text-center text-slate-500 text-sm mt-6">
                            {isTeacher ? <>Bạn là học viên? <Link to="/login" className="font-medium text-cyan-600 hover:underline">Đăng nhập tại đây</Link></> : <>Bạn là giảng viên? <Link to="/teacher/login" className="font-medium text-rose-600 hover:underline">Đăng nhập tại đây</Link></>}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
