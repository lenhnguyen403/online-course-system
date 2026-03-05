import { Link, useNavigate } from 'react-router-dom'
import { removeToken } from '../../store/storage'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import { FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'
import { useState, useRef, useEffect } from 'react'
import './Header.css'
import { useTheme } from '../../contexts/ThemeContext'
import { useI18n } from '../../contexts/I18nContext'

const Header = () => {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { theme, toggleTheme } = useTheme()
  const { t, lang, setLang } = useI18n()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const logout = async (e) => {
    e.preventDefault()
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      await axiosClient.post('/auth/logout', refreshToken ? { refreshToken } : {})
      removeToken()
      navigate('/')
      ToastMessage.success('Đăng xuất thành công')
    } catch (err) {
      removeToken()
      navigate('/')
      ToastMessage.error(err)
    }
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-4 h-14 px-6 border-b border-slate-200 bg-white/90 backdrop-blur shadow-sm">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder={t('header.searchPlaceholder')}
            className="w-full py-2 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400"
          />
        </div>
      </div>
      <div className="relative flex items-center gap-2" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100"
        >
          {lang === 'vi' ? 'EN' : 'VI'}
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100"
        >
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <FaUserCircle className="text-xl text-slate-500" />
          <span className="hidden sm:inline text-sm font-medium">{t('header.account')}</span>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 py-2 bg-white rounded-xl border border-slate-200 shadow-lg z-50">
            <Link to="/dashboard" className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50" onClick={() => setDropdownOpen(false)}>
              {t('nav.dashboard')}
            </Link>
            <button type="button" onClick={(e) => { setDropdownOpen(false); logout(e); }} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 text-left">
              <FaSignOutAlt className="text-slate-400" />
              {t('header.logout')}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header