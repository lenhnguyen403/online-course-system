import React from 'react'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import { removeToken } from '../../store/storage'
import ToastMessage from '../../messages/ToastMessage'
import { axiosClient } from '../../utils/axiosClient'
import { FaUserGraduate, FaHome, FaBook, FaTasks, FaMoneyBillWave, FaChartBar, FaCalendarAlt, FaBullhorn, FaBell, FaUser, FaSignOutAlt, FaCertificate, FaChartLine, FaGraduationCap } from 'react-icons/fa'

const StudentLayout = () => {
  const navigate = useNavigate()

  const logout = async (e) => {
    e.preventDefault()
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      await axiosClient.post('/auth/logout', refreshToken ? { refreshToken } : {})
      removeToken()
      localStorage.removeItem('user')
      navigate('/login')
      ToastMessage.success('Đăng xuất thành công')
    } catch (err) {
      removeToken()
      localStorage.removeItem('user')
      navigate('/login')
      ToastMessage.error(err)
    }
  }

  const nav = [
    { to: '/student', end: true, label: 'Trang chủ', icon: FaHome },
    { to: '/student/classes', end: false, label: 'Lớp của tôi', icon: FaBook },
    { to: '/student/my-courses', end: false, label: 'Khóa học của tôi', icon: FaGraduationCap },
    { to: '/student/assignments', end: false, label: 'Bài tập', icon: FaTasks },
    { to: '/student/payments', end: false, label: 'Lịch sử học phí', icon: FaMoneyBillWave },
    { to: '/student/exams', end: false, label: 'Điểm thi', icon: FaChartBar },
    { to: '/student/calendar', end: false, label: 'Lịch', icon: FaCalendarAlt },
    { to: '/student/announcements', end: false, label: 'Thông báo lớp', icon: FaBullhorn },
    { to: '/student/notifications', end: false, label: 'Thông báo', icon: FaBell },
    { to: '/student/certificates', end: false, label: 'Chứng nhận', icon: FaCertificate },
    { to: '/student/learning-report', end: false, label: 'Báo cáo học tập', icon: FaChartLine },
    { to: '/student/profile', end: false, label: 'Cá nhân', icon: FaUser },
  ]

  return (
    <div className="min-h-screen flex bg-slate-50/80">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white shadow-sm flex flex-col">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white">
              <FaUserGraduate className="text-lg" />
            </div>
            <div>
              <div className="font-bold text-slate-800">Học viên</div>
              <div className="text-xs text-slate-500">LMS Portal</div>
            </div>
          </div>
        </div>
        <nav className="p-3 flex-1">
          {nav.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 font-medium transition-colors ${
                  isActive ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25' : 'text-slate-600 hover:bg-cyan-50 hover:text-cyan-700'
                }`
              }
            >
              <Icon className="text-lg shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-800 font-medium transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default StudentLayout
