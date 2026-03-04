import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import Header from './Header/Header'
import Logo from '../components/Logo'

const menuItems = [
  { path: '/dashboard', label: 'Tổng quan' },
  { path: '/dashboard/create-user', label: 'Tạo tài khoản' },
  { path: '/dashboard/users', label: 'Người dùng' },
  { path: '/dashboard/subjects', label: 'Môn học' },
  { path: '/dashboard/courses', label: 'Khóa học' },
  { path: '/dashboard/classes', label: 'Lớp học' },
  { path: '/dashboard/payments', label: 'Học phí' },
  { path: '/dashboard/journals', label: 'Nhật ký' },
  { path: '/dashboard/reports', label: 'Báo cáo' },
]

export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50/80">
      <aside className="w-64 shrink-0 flex flex-col border-r border-slate-200 bg-white shadow-sm z-20">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <Logo className="h-8 w-auto max-w-[100px]" />
            <div>
              <div className="font-bold text-slate-800 text-sm">Admin</div>
              <div className="text-xs text-slate-500">LMS</div>
            </div>
          </div>
        </div>
        <nav className="p-3 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl mb-1 font-medium transition-colors ${
                  isActive ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <Header />
        <main className="flex-1 p-6 md:p-8 lg:pt-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
