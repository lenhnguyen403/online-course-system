import './Login.css'
import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const [token, setToken] = useState('')
    // const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()  // Ngăn chặn hành vi mặc định của form (tải lại trang)

        try {
            const response = await axiosClient.post(`/auth/login`, { email, password })

            // console.log(response.data);

            // Lưu token vào localStorage
            if (response.data.accessToken && response.data.refreshToken) {
                localStorage.setItem('accessToken', response.data.accessToken);
                // localStorage.setItem('refreshToken', response.data.refreshToken);
                // console.log('Tokens stored in localStorage.');
                // console.log('Token:', response.data.accessToken);
                // console.log('After set:', localStorage.getItem('accessToken'));
                // console.log('All storage:', { ...localStorage });

                // Kiem tra dang nhap theo role (admin, staff, teacher, student)
                // navigate('/')
            } else {
                console.error('Tokens not found in response.');
            }

        } catch (error) {
            console.error('Error occurred:', error);
        }

    }

    return (
        <>
            <div className='login relative min-h-screen'>
                <div className="login-overlay fixed inset-0"></div>
                <div className="login-form p-7 absolute top-2/4 left-2/4 -translate-1/2 
                        bg-gray-50 w-full max-w-sm md:max-w-md rounded-md">
                    <form onSubmit={handleSubmit}>
                        <h2 className='text-center uppercase text-base font-bold'>Login</h2>
                        <div className="form-group mb-4">
                            <label htmlFor="email" className='inline-block mb-2'>Email</label>
                            <input type="text"
                                className='form-control p-2 w-full border border-gray-300 focus:border-cyan-600 
                                    outline-none transition rounded'
                                id="email"
                                placeholder='Enter Your Email'
                                required
                                onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group mb-4">
                            <label htmlFor="password" className='inline-block mb-2'>Password</label>
                            <input type="password"
                                className='form-control p-2 w-full border border-gray-300 focus:border-cyan-600 
                                    outline-none transition rounded'
                                id="password"
                                placeholder='Enter Your Password'
                                required
                                onChange={(e) => setPassword(e.target.value)} />
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
