import { createContext, useContext, useMemo, useState } from 'react'

const translations = {
  vi: {
    'lang.vi': 'Tiếng Việt',
    'lang.en': 'English',
    'nav.dashboard': 'Tổng quan',
    'nav.createUser': 'Tạo tài khoản',
    'nav.users': 'Người dùng',
    'nav.subjects': 'Môn học',
    'nav.courses': 'Khóa học',
    'nav.classes': 'Lớp học',
    'nav.payments': 'Học phí',
    'nav.journals': 'Nhật ký',
    'nav.reports': 'Báo cáo',
    'header.searchPlaceholder': 'Tìm kiếm...',
    'header.account': 'Tài khoản',
    'header.logout': 'Đăng xuất',
  },
  en: {
    'lang.vi': 'Vietnamese',
    'lang.en': 'English',
    'nav.dashboard': 'Dashboard',
    'nav.createUser': 'Create account',
    'nav.users': 'Users',
    'nav.subjects': 'Subjects',
    'nav.courses': 'Courses',
    'nav.classes': 'Classes',
    'nav.payments': 'Tuition',
    'nav.journals': 'Journals',
    'nav.reports': 'Reports',
    'header.searchPlaceholder': 'Search...',
    'header.account': 'Account',
    'header.logout': 'Log out',
  },
}

export const I18nContext = createContext(null)

export const I18nProvider = ({ children, defaultLang = 'vi' }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('admin_lang') || defaultLang)

  const value = useMemo(() => {
    const t = (key) => translations[lang]?.[key] || translations.vi[key] || key
    const changeLang = (next) => {
      setLang(next)
      localStorage.setItem('admin_lang', next)
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

