import React from 'react'
import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom'
import { removeToken } from '../../store/storage'
import ToastMessage from '../../messages/ToastMessage'
import { axiosClient } from '../../utils/axiosClient'

const TeacherLayout = () => {
    const navigate = useNavigate()

    const logout = async (e) => {
        e.preventDefault()
        const refreshToken = localStorage.getItem('refreshToken')
        try {
            const res = await axiosClient.post('/auth/logout', refreshToken ? { refreshToken } : {})
            removeToken()
            localStorage.removeItem('user')
            navigate('/login')
            ToastMessage.success(res.data?.message ?? 'Đăng xuất thành công')
        } catch (err) {
            removeToken()
            localStorage.removeItem('user')
            navigate('/login')
            ToastMessage.error(err)
        }
    }

    const nav = [
        { to: '/teacher', end: true, label: 'Tổng quan' },
        { to: '/teacher/classes', end: false, label: 'Lớp của tôi' },
        { to: '/teacher/profile', end: false, label: 'Cá nhân' },
    ]
    return (
        <div className="min-h-screen flex bg-slate-50/80">
            <aside className="w-64 shrink-0 border-r border-slate-200 bg-white shadow-sm flex flex-col">
                <div className="p-5 border-b border-slate-100">
                    <div className="font-bold text-slate-800">Giảng viên</div>
                    <div className="text-xs text-slate-500">LMS Portal</div>
                </div>
                <nav className="p-3 flex-1">
                    {nav.map(({ to, end, label }) => (
                        <NavLink key={to} to={to} end={end} className={({ isActive }) => `block px-4 py-3 rounded-xl mb-1 font-medium transition-colors ${isActive ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25' : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'}`}>
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-3 border-t border-slate-100">
                    <button type="button" onClick={logout} className="w-full px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-left">
                        Đăng xuất
                    </button>
                </div>
            </aside>
            <main className="flex-1 min-w-0 p-6 md:p-8">
                <div className="max-w-5xl mx-auto"><Outlet /></div>
            </main>
        </div>
    )
}

export default TeacherLayout
