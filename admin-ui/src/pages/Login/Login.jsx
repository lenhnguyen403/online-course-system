import './Login.css'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import AdminDashboard from '../Dashboard/AdminDashboard'
import TeacherLayout from '../Teacher/TeacherLayout'
import StudentLayout from '../Student/StudentLayout'

const Login = () => {
    const navigate = useNavigate()
    // const [error, setError] = useState('')
    const location = useLocation()
    const isTeacher = location.pathname.includes('/teacher')

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

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
                localStorage.setItem('accessToken', data.accessToken);
                // console.log('Tokens stored in localStorage.');
                // console.log('Token:', data.accessToken);
                // console.log('After set:', localStorage.getItem('accessToken'));
                // console.log('All storage:', { ...localStorage });

                // Kiem tra dang nhap theo role (admin, staff, teacher, student)
                const role = data.user.role;

                if (role === 'admin' || role === 'staff') {
                    navigate('/dashboard')
                } else if (role === 'teacher') {
                    navigate('/teacher')
                } else {
                    navigate('/student')
                }

            } else {
                console.error('Tokens not found in response.');
            }

        } catch (error) {
            console.error('Error occurred:', error);
        }
    }


    return (
        <>
            <div className={`login relative min-h-screen bg-cover bg-no-repeat bg-center
                    ${isTeacher
                    ? 'bg-[url("/bg-teacher-image.png")]'
                    : 'bg-[url("/bg-image.jpg")]'}`}>
                <div className={`${isTeacher ? 'login-teacher-overlay' : 'login-overlay'} fixed inset-0`}></div>
                <div className={`login-form p-7 bg-gray-50  w-full max-w-sm md:max-w-md absolute 
                    ${isTeacher
                        ? 'right-0 bottom-0 top-0'
                        : 'top-2/4 left-2/4 -translate-1/2 rounded-md'}`}>
                    <form onSubmit={handleSubmit}>
                        <h2 className='text-center uppercase text-base font-bold'>Login</h2>
                        <div className="form-group mb-4">
                            <label htmlFor="email" className='inline-block mb-2'>Email</label>
                            <input type="text"
                                className='form-control p-2 w-full border border-gray-300 focus:border-cyan-600 
                                    outline-none transition rounded'
                                id="email"
                                name='email'
                                placeholder='Enter Your Email'
                                required
                                value={formData.email}
                                onChange={handleChange} />
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="password" className='inline-block mb-2'>Password</label>
                            <input type="password"
                                className='form-control p-2 w-full border border-gray-300 focus:border-cyan-600 
                                    outline-none transition rounded'
                                id="password"
                                name='password'
                                placeholder='Enter Your Password'
                                required
                                value={formData.password}
                                onChange={handleChange} />
                        </div>
                        <button type='submit'
                            className='btn btn-primary p-3 mt-3 mb-2 text-white text-center font-semibold uppercase text-sm 
                                bg-cyan-700 hover:bg-cyan-600 transition rounded w-full lg:cursor-pointer '
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
