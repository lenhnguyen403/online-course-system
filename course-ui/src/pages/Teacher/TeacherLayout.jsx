import React from 'react'
import { Outlet, useNavigate, NavLink } from 'react-router-dom'
import { removeToken } from '../../store/storage'
import ToastMessage from '../../messages/ToastMessage'
import { axiosClient } from '../../utils/axiosClient'
import { useTheme } from '../../contexts/ThemeContext'
import { useI18n } from '../../contexts/I18nContext'
import { FaTachometerAlt, FaBookOpen, FaTasks, FaCalendarAlt, FaUser, FaSignOutAlt } from 'react-icons/fa'

const nav = [
  { to: '/teacher', end: true, labelKey: 'teacher.nav.dashboard', icon: FaTachometerAlt },
  { to: '/teacher/classes', end: false, labelKey: 'teacher.nav.classes', icon: FaBookOpen },
  { to: '/teacher/pending-submissions', end: false, labelKey: 'teacher.nav.pendingSubmissions', icon: FaTasks },
  { to: '/teacher/calendar', end: false, labelKey: 'teacher.nav.calendar', icon: FaCalendarAlt },
  { to: '/teacher/profile', end: false, labelKey: 'teacher.nav.profile', icon: FaUser },
]

const TeacherLayout = () => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const { t, lang, setLang } = useI18n()

  const logout = async (e) => {
    e.preventDefault()
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      const res = await axiosClient.post('/auth/logout', refreshToken ? { refreshToken } : {})
      removeToken()
      localStorage.removeItem('user')
      navigate('/teacher/login')
      ToastMessage.success(res.data?.message ?? 'Đăng xuất thành công')
    } catch (err) {
      removeToken()
      localStorage.removeItem('user')
      navigate('/teacher/login')
      ToastMessage.error(err)
    }
  }
    return (
        <div className="min-h-screen flex bg-slate-50/80">
            <aside className="w-64 shrink-0 border-r border-slate-200 bg-white shadow-sm flex flex-col">
                <div className="p-5 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center text-white">
                            <FaUser className="text-lg" />
                        </div>
                        <div>
                            <div className="font-bold text-slate-800">{t('teacher.sidebar.title') || 'Giảng viên'}</div>
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
                        <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 font-medium transition-colors ${isActive ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25' : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'}`}>
                            <Icon className="text-lg shrink-0" />
                            {t(labelKey)}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-3 border-t border-slate-100">
                    <button type="button" onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-medium text-left">
                        <FaSignOutAlt className="text-lg" />
                        {t('common.logout')}
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
