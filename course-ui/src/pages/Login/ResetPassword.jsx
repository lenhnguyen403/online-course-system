import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ToastMessage from '../../messages/ToastMessage'

const baseURL = import.meta.env.VITE_BACKEND_URL || ''

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!token) ToastMessage.error('Link không hợp lệ. Thiếu token.')
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) { ToastMessage.error('Mật khẩu tối thiểu 6 ký tự'); return }
    if (password !== confirm) { ToastMessage.error('Mật khẩu xác nhận không khớp'); return }
    if (!token) return
    setLoading(true)
    try {
      await axios.post(`${baseURL}/auth/reset-password`, { token, newPassword: password })
      setDone(true)
      ToastMessage.success('Đặt lại mật khẩu thành công.')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      ToastMessage.error(err?.response?.data?.message || 'Đặt lại mật khẩu thất bại')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-cyan-50">
        <div className="card card-body max-w-md text-center">
          <p className="text-slate-600">Link không hợp lệ hoặc đã hết hạn.</p>
          <Link to="/forgot-password" className="text-cyan-600 font-medium mt-4 inline-block">Gửi lại link</Link>
          <Link to="/login" className="text-slate-600 text-sm mt-2 inline-block">Đăng nhập</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="w-full max-w-md">
        <div className="card shadow-xl shadow-slate-200/50">
          <div className="card-body">
            <h1 className="text-xl font-bold text-slate-800 text-center mb-2">Đặt lại mật khẩu</h1>
            {done ? (
              <p className="text-center text-cyan-600 font-medium py-4">Đã đổi mật khẩu. Đang chuyển về trang đăng nhập...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" minLength={6} required className="w-full rounded-xl border border-slate-200 px-4 py-2.5" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu</label>
                  <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Nhập lại mật khẩu" required className="w-full rounded-xl border border-slate-200 px-4 py-2.5" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-70">
                  {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </button>
                <p className="text-center">
                  <Link to="/login" className="text-cyan-600 text-sm font-medium hover:underline">Quay lại đăng nhập</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
