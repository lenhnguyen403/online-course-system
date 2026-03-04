import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaMapMarkerAlt, FaIdCard, FaLock, FaEdit } from 'react-icons/fa'

const Field = ({ icon: Icon, label, value }) => (
  <div className="flex gap-4 py-4 border-b border-slate-100 last:border-0">
    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
      <Icon className="text-lg" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 font-medium text-slate-800">{value || '—'}</p>
    </div>
  </div>
)

export default function TeacherProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ fullName: '', phoneNumber: '', dateOfBirth: '', address: '', identityNumber: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)

  const loadUser = () => {
    axiosClient.get('/me')
      .then((res) => {
        setUser(res.data)
        setEditForm({
          fullName: res.data.fullName || '',
          phoneNumber: res.data.phoneNumber || '',
          dateOfBirth: res.data.dateOfBirth ? new Date(res.data.dateOfBirth).toISOString().slice(0, 10) : '',
          address: res.data.address || '',
          identityNumber: res.data.identityNumber || '',
        })
      })
      .catch(ToastMessage.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadUser() }, [])

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    setSaving(true)
    axiosClient.put('/me', editForm)
      .then((res) => { setUser(res.data); setEditing(false); ToastMessage.success('Đã cập nhật thông tin') })
      .catch(ToastMessage.error)
      .finally(() => setSaving(false))
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      ToastMessage.error('Mật khẩu mới và xác nhận không khớp')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      ToastMessage.error('Mật khẩu mới tối thiểu 6 ký tự')
      return
    }
    setSaving(true)
    axiosClient.put('/me/change-password', { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })
      .then(() => { setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); ToastMessage.success('Đã đổi mật khẩu') })
      .catch(ToastMessage.error)
      .finally(() => setSaving(false))
  }

  if (loading || !user) return <LoadingSpinner />

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[{ to: '/teacher', label: 'Tổng quan' }, { label: 'Cá nhân' }]}
        title="Thông tin cá nhân"
        description="Xem và quản lý thông tin tài khoản giảng viên."
      />

      <div className="card overflow-hidden max-w-2xl">
        <div className="card-body">
          <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <FaUser className="text-4xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{user.fullName}</h2>
                <p className="text-slate-500">{user.email}</p>
                {user.role && (
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                    Giảng viên
                  </span>
                )}
              </div>
            </div>
            {!editing && (
              <button type="button" onClick={() => setEditing(true)} className="btn-secondary text-sm inline-flex items-center gap-2">
                <FaEdit /> Chỉnh sửa
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <label className="block">
                <span className="text-sm text-slate-500">Họ và tên</span>
                <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} className="mt-1 w-full border rounded-xl px-4 py-2" required />
              </label>
              <label className="block">
                <span className="text-sm text-slate-500">Số điện thoại</span>
                <input type="text" value={editForm.phoneNumber} onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })} className="mt-1 w-full border rounded-xl px-4 py-2" />
              </label>
              <label className="block">
                <span className="text-sm text-slate-500">Ngày sinh</span>
                <input type="date" value={editForm.dateOfBirth} onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })} className="mt-1 w-full border rounded-xl px-4 py-2" />
              </label>
              <label className="block">
                <span className="text-sm text-slate-500">Địa chỉ</span>
                <input type="text" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className="mt-1 w-full border rounded-xl px-4 py-2" />
              </label>
              <label className="block">
                <span className="text-sm text-slate-500">CMND/CCCD</span>
                <input type="text" value={editForm.identityNumber} onChange={(e) => setEditForm({ ...editForm, identityNumber: e.target.value })} className="mt-1 w-full border rounded-xl px-4 py-2" />
              </label>
              <p className="text-xs text-slate-400">Email không thể thay đổi.</p>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Hủy</button>
              </div>
            </form>
          ) : (
            <div className="space-y-0">
              <Field icon={FaUser} label="Họ và tên" value={user.fullName} />
              <Field icon={FaEnvelope} label="Email" value={user.email} />
              <Field icon={FaPhone} label="Số điện thoại" value={user.phoneNumber} />
              <Field icon={FaBirthdayCake} label="Ngày sinh" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : null} />
              <Field icon={FaMapMarkerAlt} label="Địa chỉ" value={user.address} />
              <Field icon={FaIdCard} label="CMND/CCCD" value={user.identityNumber} />
            </div>
          )}
        </div>
      </div>

      <div className="card overflow-hidden max-w-2xl">
        <div className="card-body">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FaLock className="text-slate-500" /> Đổi mật khẩu
          </h3>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <label className="block">
              <span className="text-sm text-slate-500">Mật khẩu hiện tại</span>
              <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} className="mt-1 w-full border rounded-xl px-4 py-2" required />
            </label>
            <label className="block">
              <span className="text-sm text-slate-500">Mật khẩu mới</span>
              <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="mt-1 w-full border rounded-xl px-4 py-2" minLength={6} required />
            </label>
            <label className="block">
              <span className="text-sm text-slate-500">Xác nhận mật khẩu mới</span>
              <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="mt-1 w-full border rounded-xl px-4 py-2" minLength={6} required />
            </label>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Đang xử lý...' : 'Đổi mật khẩu'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
