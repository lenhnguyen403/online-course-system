import axios from 'axios'
import { getToken } from '../store/storage'

// Vite nhúng env lúc build: cần set VITE_BACKEND_URL trên Vercel (admin-ui) trước khi build
const baseURL = import.meta.env.VITE_BACKEND_URL || ''
export const axiosClient = axios.create({
    baseURL: baseURL.replace(/\/$/, ''), // bỏ dấu / cuối để nối path đúng
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosClient.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

axiosClient.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            window.location.href = '/'
        }
        return Promise.reject(err)
    }
)