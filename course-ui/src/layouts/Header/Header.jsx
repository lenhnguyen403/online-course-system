import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import { FaBars, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa'

const Header = () => {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="flex items-center justify-between gap-4 px-4 md:px-8 h-16 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Logo className="h-8 w-auto max-w-[120px] md:max-w-[140px]" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate('/teacher/login')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-600 hover:text-orange-600 hover:bg-orange-50 font-medium transition-colors"
          >
            <FaChalkboardTeacher className="text-lg" />
            Giảng viên
          </button>
          <Link
            to="/login"
            className="btn-primary text-sm"
          >
            <FaUserGraduate className="text-lg" />
            Đăng nhập
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
          aria-label="Menu"
        >
          <FaBars className="text-xl" />
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur p-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => { navigate('/teacher/login'); setMobileOpen(false) }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-slate-50 text-left font-medium"
          >
            <FaChalkboardTeacher /> Giảng viên
          </button>
          <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary justify-center">
            <FaUserGraduate /> Đăng nhập
          </Link>
        </div>
      )}
    </header>
  )
}

export default Header
