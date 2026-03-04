import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaMapMarkerAlt } from 'react-icons/fa'

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

export default function StudentProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get('/me')
      .then((res) => setUser(res.data))
      .catch(ToastMessage.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading || !user) return <LoadingSpinner />

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { label: 'Cá nhân' }]}
        title="Thông tin cá nhân"
        description="Xem và quản lý thông tin tài khoản học viên."
      />

      <div className="card overflow-hidden max-w-2xl">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
            <div className="w-20 h-20 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
              <FaUser className="text-4xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{user.fullName}</h2>
              <p className="text-slate-500">{user.email}</p>
              {user.role && (
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                  Học viên
                </span>
              )}
            </div>
          </div>
          <div className="space-y-0">
            <Field icon={FaUser} label="Họ và tên" value={user.fullName} />
            <Field icon={FaEnvelope} label="Email" value={user.email} />
            <Field icon={FaPhone} label="Số điện thoại" value={user.phoneNumber} />
            <Field icon={FaBirthdayCake} label="Ngày sinh" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : null} />
            <Field icon={FaMapMarkerAlt} label="Địa chỉ" value={user.address} />
          </div>
        </div>
      </div>
    </div>
  )
}
