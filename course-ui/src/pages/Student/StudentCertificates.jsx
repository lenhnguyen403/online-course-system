import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import { FaCertificate } from 'react-icons/fa'

export default function StudentCertificates() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get('/me/completions')
      .then((res) => setList(Array.isArray(res.data) ? res.data : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { label: 'Chứng nhận' }]}
        title="Chứng nhận hoàn thành khóa"
        description="Các khóa học bạn đã hoàn thành 100% và được cấp chứng nhận."
      />

      {list.length === 0 ? (
        <div className="card">
          <EmptyState icon={FaCertificate} title="Chưa có chứng nhận" description="Hoàn thành 100% nội dung khóa học để nhận chứng nhận." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map((c) => (
            <div key={c._id} className="card card-body border border-amber-200 bg-amber-50/50">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <FaCertificate className="text-2xl" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800">{c.courseId?.courseName || 'Khóa học'}</h3>
                  <p className="text-sm text-slate-500">{c.classId?.className} · {c.classId?.classCode}</p>
                  <p className="text-xs text-slate-400 mt-1">Hoàn thành: {new Date(c.completedAt).toLocaleDateString('vi')}</p>
                  <Link to={`/student/certificate/${c.courseId?._id}`} className="mt-3 inline-block text-sm font-medium text-cyan-600 hover:text-cyan-700">
                    Xem chứng nhận →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
