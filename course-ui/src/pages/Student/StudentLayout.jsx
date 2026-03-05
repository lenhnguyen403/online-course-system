import React from 'react'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import { removeToken } from '../../store/storage'
import ToastMessage from '../../messages/ToastMessage'
import { axiosClient } from '../../utils/axiosClient'
import { useTheme } from '../../contexts/ThemeContext'
import { useI18n } from '../../contexts/I18nContext'
import { FaUserGraduate, FaHome, FaBook, FaTasks, FaMoneyBillWave, FaChartBar, FaCalendarAlt, FaBullhorn, FaBell, FaUser, FaSignOutAlt, FaCertificate, FaChartLine, FaGraduationCap } from 'react-icons/fa'

const StudentLayout = () => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { t, lang, setLang } = useI18n()

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
    { to: '/student', end: true, labelKey: 'student.nav.home', icon: FaHome },
    { to: '/student/classes', end: false, labelKey: 'student.nav.classes', icon: FaBook },
    { to: '/student/my-courses', end: false, labelKey: 'student.nav.myCourses', icon: FaGraduationCap },
    { to: '/student/assignments', end: false, labelKey: 'student.nav.assignments', icon: FaTasks },
    { to: '/student/payments', end: false, labelKey: 'student.nav.payments', icon: FaMoneyBillWave },
    { to: '/student/exams', end: false, labelKey: 'student.nav.exams', icon: FaChartBar },
    { to: '/student/calendar', end: false, labelKey: 'student.nav.calendar', icon: FaCalendarAlt },
    { to: '/student/announcements', end: false, labelKey: 'student.nav.announcements', icon: FaBullhorn },
    { to: '/student/notifications', end: false, labelKey: 'student.nav.notifications', icon: FaBell },
    { to: '/student/certificates', end: false, labelKey: 'student.nav.certificates', icon: FaCertificate },
    { to: '/student/learning-report', end: false, labelKey: 'student.nav.learningReport', icon: FaChartLine },
    { to: '/student/profile', end: false, labelKey: 'student.nav.profile', icon: FaUser },
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
              <div className="font-bold text-slate-800">{t('student.sidebar.title')}</div>
              <div className="text-xs text-slate-500">LMS Portal</div>
              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                  className="px-2 py-0.5 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                >
                  {lang === 'vi' ? 'EN' : 'VI'}
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-2 py-0.5 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                >
                  {theme === 'light' ? 'Dark' : 'Light'}
                </button>
              </div>
            </div>
          </div>
        </div>
        <nav className="p-3 flex-1">
          {nav.map(({ to, end, labelKey, icon: Icon }) => (
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
              {t(labelKey)}
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
            {t('common.logout')}
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
