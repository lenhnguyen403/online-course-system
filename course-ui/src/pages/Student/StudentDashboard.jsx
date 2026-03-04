import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaMoneyBillWave, FaBookOpen, FaChartBar, FaCalendarAlt, FaWallet, FaTasks, FaBullhorn, FaCertificate, FaChartLine, FaUser, FaGraduationCap } from 'react-icons/fa'

const PAYMENT_STATUS_LABEL = { paid: 'Đã đóng', unpaid: 'Nợ học phí', overdue: 'Quá hạn', pending: 'Chờ thanh toán' }
const PAYMENT_BADGE = { paid: 'success', unpaid: 'danger', overdue: 'danger', pending: 'warning' }

export default function StudentDashboard() {
  const [user, setUser] = useState(null)
  const [nextPayment, setNextPayment] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [certificatesCount, setCertificatesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || '{}')
    if (!u.id) { setLoading(false); return }
    setUser(u)
    Promise.all([
      axiosClient.get(`/payments/students/${u.id}/next-payment`).then((res) => setNextPayment(res.data)).catch(() => setNextPayment(null)),
      axiosClient.get('/dashboard/student').then((res) => setDashboard(res.data)).catch(() => setDashboard(null)),
      axiosClient.get('/me/completions').then((res) => setCertificatesCount(Array.isArray(res.data) ? res.data.length : 0)).catch(() => setCertificatesCount(0)),
    ]).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-8">
      <PageHeader breadcrumbs={[{ label: 'Trang chủ' }]} title="Tổng quan học tập" description="Xem nhanh tình trạng học phí và truy cập lớp học, điểm thi." />

      <section className="card overflow-hidden">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <FaMoneyBillWave className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Tình trạng học phí</h2>
              <p className="text-sm text-slate-500">Đợt nộp tiếp theo và trạng thái thanh toán</p>
            </div>
          </div>
          {nextPayment ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Lớp</p>
                <p className="font-semibold text-slate-800 mt-0.5">{nextPayment.classId?.className || '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Hạn nộp</p>
                <p className="font-semibold text-slate-800 mt-0.5">{nextPayment.dueDate ? new Date(nextPayment.dueDate).toLocaleDateString('vi-VN') : '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Số tiền</p>
                <p className="font-semibold text-slate-800 mt-0.5">{nextPayment.amount != null ? `${nextPayment.amount.toLocaleString()} VNĐ` : '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Trạng thái</p>
                <div className="mt-0.5">
                  <Badge variant={PAYMENT_BADGE[nextPayment.status] || 'neutral'}>{PAYMENT_STATUS_LABEL[nextPayment.status] || nextPayment.status}</Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center bg-slate-50 rounded-xl">
              <FaWallet className="mx-auto text-3xl text-slate-300 mb-2" />
              <p className="text-slate-600 font-medium">Không có đợt nộp học phí đang chờ</p>
              <p className="text-sm text-slate-500 mt-1">Bạn đã hoàn thành các đợt thanh toán hoặc chưa có lịch thu.</p>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/student/classes" className="p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-200 flex flex-col items-center gap-1">
          <span className="text-2xl font-bold text-slate-800">{dashboard?.totalClasses ?? 0}</span>
          <span className="text-xs text-slate-500">Lớp đang học</span>
        </Link>
        <Link to="/student/certificates" className="p-4 rounded-xl border border-slate-200 bg-white hover:border-amber-200 flex flex-col items-center gap-1">
          <span className="text-2xl font-bold text-amber-600">{certificatesCount}</span>
          <span className="text-xs text-slate-500">Chứng nhận</span>
        </Link>
        <Link to="/student/learning-report" className="p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-200 flex flex-col items-center gap-1">
          <span className="text-2xl font-bold text-cyan-600">{dashboard?.totalClasses ?? 0}</span>
          <span className="text-xs text-slate-500">Báo cáo học tập</span>
        </Link>
        <Link to="/student/my-courses" className="p-4 rounded-xl border border-slate-200 bg-white hover:border-cyan-200 flex flex-col items-center gap-1">
          <FaGraduationCap className="text-2xl text-slate-600" />
          <span className="text-xs text-slate-500">Khóa học của tôi</span>
        </Link>
      </section>

      {(dashboard?.upcomingAssignments?.length > 0 || dashboard?.recentAnnouncements?.length > 0) && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboard?.upcomingAssignments?.length > 0 && (
            <div className="card card-body">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <FaTasks className="text-amber-500" /> Bài tập sắp đến hạn
              </h2>
              <ul className="space-y-2">
                {dashboard.upcomingAssignments.slice(0, 5).map((a) => (
                  <li key={a._id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="font-medium text-slate-800 truncate">{a.title}</span>
                    <span className="text-xs text-slate-500 shrink-0 ml-2">{a.dueDate ? new Date(a.dueDate).toLocaleDateString('vi') : ''}</span>
                  </li>
                ))}
              </ul>
              <Link to="/student/assignments" className="text-cyan-600 text-sm font-medium mt-2 hover:underline">Xem tất cả bài tập →</Link>
            </div>
          )}
          {dashboard?.recentAnnouncements?.length > 0 && (
            <div className="card card-body">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <FaBullhorn className="text-blue-500" /> Thông báo mới
              </h2>
              <ul className="space-y-2">
                {dashboard.recentAnnouncements.slice(0, 5).map((a) => (
                  <li key={a._id} className="py-2 border-b border-slate-100 last:border-0">
                    <p className="font-medium text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.classId?.className} · {a.authorId?.fullName}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Truy cập nhanh</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/student/classes" className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-cyan-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
              <FaBookOpen className="text-xl" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 group-hover:text-cyan-700">Lớp của tôi</p>
              <p className="text-sm text-slate-500">Xem danh sách lớp đã đăng ký</p>
            </div>
          </Link>
          <Link to="/student/payments" className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-cyan-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <FaMoneyBillWave className="text-xl" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 group-hover:text-emerald-700">Lịch sử học phí</p>
              <p className="text-sm text-slate-500">Lịch sử các đợt nộp học phí</p>
            </div>
          </Link>
          <Link to="/student/exams" className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-cyan-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
              <FaChartBar className="text-xl" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 group-hover:text-violet-700">Điểm thi</p>
              <p className="text-sm text-slate-500">Điểm các bài kiểm tra theo đợt</p>
            </div>
          </Link>
          <Link to="/student/calendar" className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-cyan-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
              <FaCalendarAlt className="text-xl" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 group-hover:text-amber-700">Lịch học</p>
              <p className="text-sm text-slate-500">Bài tập & lịch thi theo tháng</p>
            </div>
          </Link>
          <Link to="/student/certificates" className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
              <FaCertificate className="text-xl" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 group-hover:text-amber-700">Chứng nhận</p>
              <p className="text-sm text-slate-500">Chứng nhận hoàn thành khóa</p>
            </div>
          </Link>
          <Link to="/student/learning-report" className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-cyan-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
              <FaChartLine className="text-xl" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 group-hover:text-cyan-700">Báo cáo học tập</p>
              <p className="text-sm text-slate-500">Tiến độ theo lớp</p>
            </div>
          </Link>
          <Link to="/student/my-courses" className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-cyan-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <FaGraduationCap className="text-xl" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 group-hover:text-emerald-700">Khóa học của tôi</p>
              <p className="text-sm text-slate-500">Tiến độ theo khóa</p>
            </div>
          </Link>
          <Link to="/student/profile" className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-cyan-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <FaUser className="text-xl text-slate-500" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Cá nhân</p>
              <p className="text-sm text-slate-500">Thông tin & đổi mật khẩu</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
