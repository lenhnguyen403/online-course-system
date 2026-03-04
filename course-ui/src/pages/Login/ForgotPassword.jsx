import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ToastMessage from '../../messages/ToastMessage'

const baseURL = import.meta.env.VITE_BACKEND_URL || ''

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await axios.post(`${baseURL}/auth/forgot-password`, { email })
      setSent(true)
      ToastMessage.success('Nếu email tồn tại, bạn sẽ nhận link đặt lại mật khẩu.')
    } catch (err) {
      ToastMessage.error(err?.response?.data?.message || 'Gửi yêu cầu thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      <div className="w-full max-w-md">
        <div className="card shadow-xl shadow-slate-200/50">
          <div className="card-body">
            <h1 className="text-xl font-bold text-slate-800 text-center mb-2">Quên mật khẩu</h1>
            <p className="text-slate-500 text-sm text-center mb-6">Nhập email để nhận link đặt lại mật khẩu (hiệu lực 1 giờ).</p>
            {sent ? (
              <div className="text-center py-4">
                <p className="text-cyan-600 font-medium">Đã gửi email. Kiểm tra hộp thư và spam.</p>
                <Link to="/login" className="inline-block mt-4 text-cyan-600 font-medium hover:underline">Quay lại đăng nhập</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required className="w-full rounded-xl border border-slate-200 px-4 py-2.5" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-70">
                  {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
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
