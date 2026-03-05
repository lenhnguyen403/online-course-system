import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Pagination from '../../components/ui/Pagination'
import { FaBookOpen } from 'react-icons/fa'

export default function TeacherClassList() {
  const [classes, setClasses] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axiosClient.get('/classes', { params: { page: page - 1, size: pageSize } })
      .then((res) => { setClasses(res.data.data || []); setTotal(res.data.total ?? 0) })
      .catch(ToastMessage.error)
      .finally(() => setLoading(false))
  }, [page, pageSize])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-8">
      <PageHeader breadcrumbs={[{ to: '/teacher', label: 'Tổng quan' }, { label: 'Lớp của tôi' }]} title="Danh sách lớp học" description="Các lớp bạn đang phụ trách. Nhấn vào lớp để xem học viên và ghi nhật ký." />

      {classes.length === 0 ? (
        <div className="card">
          <EmptyState icon={FaBookOpen} title="Chưa có lớp nào" description="Bạn chưa được phân công lớp. Liên hệ admin hoặc giáo vụ." />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((c) => (
              <Link key={c._id} to={`/teacher/classes/${c._id}`} className="group flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-rose-300 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-200 transition-colors">
                  <FaBookOpen className="text-xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800 group-hover:text-rose-700">{c.className}</p>
                  <p className="text-sm text-slate-500">{c.classCode} · {c.courseId?.courseName || '-'}</p>
                </div>
              </Link>
            ))}
          </div>
          {classes.length > 0 && (
            <Pagination
              page={page}
              total={total}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
            />
          )}
        </>
      )}
    </div>
  )
}
