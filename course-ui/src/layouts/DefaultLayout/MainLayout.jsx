import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { FaChalkboardTeacher, FaUserGraduate, FaBookOpen, FaMoneyBillWave, FaChartLine, FaClipboardList } from 'react-icons/fa'
import './MainLayout.css'

const MainLayout = () => {
  const revealRefs = useRef([])

  useEffect(() => {
    const observers = []
    const observerOptions = { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.15 }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    }, observerOptions)

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const setRevealRef = (el, i) => {
    revealRefs.current[i] = el
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="hero-gradient hero-grid relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-72 rounded-full bg-orange-500/10 blur-3xl hero-float" />
          <div className="w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl hero-float-delay absolute right-1/4 top-1/4" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
            <span>Hệ thống</span>{' '}
            <span className="text-orange-400">Quản lý</span>{' '}
            <span>Đào tạo</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 reveal" ref={(el) => setRevealRef(el, 0)}>
            Nền tảng LMS giúp quản lý lớp học, theo dõi học phí, nhật ký giảng dạy và kết quả học tập — dành cho Học viên, Giảng viên và Giáo vụ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center reveal" ref={(el) => setRevealRef(el, 1)}>
            <Link
              to="/login"
              className="hero-glow inline-flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors"
            >
              <FaUserGraduate className="text-xl" />
              Đăng nhập Học viên
            </Link>
            <Link
              to="/teacher/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors"
            >
              <FaChalkboardTeacher className="text-xl" />
              Đăng nhập Giảng viên
            </Link>
          </div>
        </div>
      </section>

      {/* Giới thiệu */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6 reveal" ref={(el) => setRevealRef(el, 2)}>
            Giới thiệu về hệ thống
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed reveal" ref={(el) => setRevealRef(el, 3)}>
            Hệ thống Quản lý Đào tạo (LMS) hỗ trợ trung tâm quản lý môn học, khóa học, lớp học và học viên. Giảng viên theo dõi lớp, ghi nhật ký; Học viên xem học phí và điểm thi; Giáo vụ nhập điểm và báo cáo — tất cả trên một nền tảng thống nhất.
          </p>
        </div>
      </section>

      {/* Tính năng */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-4 reveal" ref={(el) => setRevealRef(el, 4)}>
            Tính năng nổi bật
          </h2>
          <p className="text-slate-600 text-center mb-14 reveal" ref={(el) => setRevealRef(el, 5)}>
            Quản lý toàn diện từ lớp học đến học phí và báo cáo
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children" ref={(el) => setRevealRef(el, 6)}>
            <div className="feature-card reveal rounded-2xl p-6 bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center mb-4">
                <FaBookOpen className="text-xl" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Quản lý lớp & khóa học</h3>
              <p className="text-slate-600 text-sm">Môn học, khóa học, lớp học và phân công giảng viên — quản lý tập trung.</p>
            </div>
            <div className="feature-card reveal rounded-2xl p-6 bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center mb-4">
                <FaClipboardList className="text-xl" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Nhật ký & theo dõi</h3>
              <p className="text-slate-600 text-sm">Nhật ký lớp và nhật ký từng học viên, trạng thái đăng ký theo thời gian thực.</p>
            </div>
            <div className="feature-card reveal rounded-2xl p-6 bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center mb-4">
                <FaMoneyBillWave className="text-xl" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Học phí & điểm thi</h3>
              <p className="text-slate-600 text-sm">Học viên xem tình trạng học phí và điểm từng đợt thi; Giáo vụ nhập điểm.</p>
            </div>
            <div className="feature-card reveal rounded-2xl p-6 bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center mb-4">
                <FaChartLine className="text-xl" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">Báo cáo & thống kê</h3>
              <p className="text-slate-600 text-sm">Số HV theo GV, điểm trung bình lớp, biểu đồ điểm và snapshot hàng tháng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Đăng nhập theo vai trò */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 text-center mb-4 reveal" ref={(el) => setRevealRef(el, 7)}>
            Đăng nhập theo vai trò
          </h2>
          <p className="text-slate-600 text-center mb-14 reveal" ref={(el) => setRevealRef(el, 8)}>
            Chọn đúng đường dẫn để vào hệ thống
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              to="/login"
              className="role-card reveal rounded-2xl p-8 bg-white border border-slate-200 shadow-sm flex flex-col items-center text-center"
              ref={(el) => setRevealRef(el, 9)}
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4">
                <FaUserGraduate className="text-3xl" />
              </div>
              <h3 className="font-bold text-slate-800 text-xl mb-2">Học viên</h3>
              <p className="text-slate-600 text-sm mb-6">Xem lớp học, học phí, lịch sử nộp tiền và điểm các bài kiểm tra.</p>
              <span className="text-cyan-600 font-semibold">Đăng nhập Học viên →</span>
            </Link>
            <Link
              to="/teacher/login"
              className="role-card reveal rounded-2xl p-8 bg-white border border-slate-200 shadow-sm flex flex-col items-center text-center"
              ref={(el) => setRevealRef(el, 10)}
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <FaChalkboardTeacher className="text-3xl" />
              </div>
              <h3 className="font-bold text-slate-800 text-xl mb-2">Giảng viên</h3>
              <p className="text-slate-600 text-sm mb-6">Xem lớp của mình, danh sách học viên, ghi nhật ký lớp và nhật ký học viên.</p>
              <span className="text-rose-600 font-semibold">Đăng nhập Giảng viên →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-slate-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 reveal" ref={(el) => setRevealRef(el, 11)}>
            Sẵn sàng sử dụng?
          </h2>
          <p className="text-slate-300 text-lg mb-8 reveal" ref={(el) => setRevealRef(el, 12)}>
            Đăng nhập ngay để truy cập lớp học, học phí và điểm thi.
          </p>
          <div className="flex flex-wrap justify-center gap-4 reveal" ref={(el) => setRevealRef(el, 13)}>
            <Link to="/login" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors">
              Học viên
            </Link>
            <Link to="/teacher/login" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/30 transition-colors">
              Giảng viên
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default MainLayout
