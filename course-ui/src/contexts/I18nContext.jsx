import { createContext, useContext, useMemo, useState } from 'react'

const translations = {
  vi: {
    'lang.vi': 'Tiếng Việt',
    'lang.en': 'English',
    // Student nav
    'student.nav.home': 'Trang chủ',
    'student.nav.classes': 'Lớp của tôi',
    'student.nav.myCourses': 'Khóa học của tôi',
    'student.nav.assignments': 'Bài tập',
    'student.nav.payments': 'Lịch sử học phí',
    'student.nav.exams': 'Điểm thi',
    'student.nav.calendar': 'Lịch',
    'student.nav.announcements': 'Thông báo lớp',
    'student.nav.notifications': 'Thông báo',
    'student.nav.certificates': 'Chứng nhận',
    'student.nav.learningReport': 'Báo cáo học tập',
    'student.nav.profile': 'Cá nhân',
    // Teacher nav
    'teacher.nav.dashboard': 'Tổng quan',
    'teacher.nav.classes': 'Lớp của tôi',
    'teacher.nav.pendingSubmissions': 'Bài nộp chờ chấm',
    'teacher.nav.calendar': 'Lịch',
    'teacher.nav.profile': 'Cá nhân',
    // Common
    'common.logout': 'Đăng xuất',
    'student.sidebar.title': 'Học viên',
    'teacher.sidebar.title': 'Giảng viên',
  },
  en: {
    'lang.vi': 'Vietnamese',
    'lang.en': 'English',
    'student.nav.home': 'Home',
    'student.nav.classes': 'My classes',
    'student.nav.myCourses': 'My courses',
    'student.nav.assignments': 'Assignments',
    'student.nav.payments': 'Payments',
    'student.nav.exams': 'Exams',
    'student.nav.calendar': 'Calendar',
    'student.nav.announcements': 'Class announcements',
    'student.nav.notifications': 'Notifications',
    'student.nav.certificates': 'Certificates',
    'student.nav.learningReport': 'Learning report',
    'student.nav.profile': 'Profile',
    'teacher.nav.dashboard': 'Dashboard',
    'teacher.nav.classes': 'My classes',
    'teacher.nav.pendingSubmissions': 'Pending submissions',
    'teacher.nav.calendar': 'Calendar',
    'teacher.nav.profile': 'Profile',
    'common.logout': 'Log out',
    'student.sidebar.title': 'Student',
    'teacher.sidebar.title': 'Teacher',
  },
}

export const I18nContext = createContext(null)

export const I18nProvider = ({ children, defaultLang = 'vi' }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('course_lang') || defaultLang)

  const value = useMemo(() => {
    const t = (key) => translations[lang]?.[key] || translations.vi[key] || key
    const changeLang = (next) => {
      setLang(next)
      localStorage.setItem('course_lang', next)
    }
    return { lang, setLang: changeLang, t }
  }, [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = () => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

