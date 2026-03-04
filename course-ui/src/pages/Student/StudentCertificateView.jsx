import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaCertificate } from 'react-icons/fa'

export default function StudentCertificateView() {
  const { courseId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get(`/me/certificate/${courseId}`)
      .then((res) => setData(res.data))
      .catch((err) => { ToastMessage.error(err); setData(null) })
      .finally(() => setLoading(false))
  }, [courseId])

  if (loading) return <LoadingSpinner />
  if (!data) return <div className="space-y-4"><PageHeader breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { to: '/student/certificates', label: 'Chứng nhận' }, { label: 'Chi tiết' }]} title="Chứng nhận" /><p className="text-slate-500">Không thể tải chứng nhận. Bạn cần hoàn thành 100% khóa học.</p><Link to="/student/certificates" className="text-cyan-600">← Danh sách chứng nhận</Link></div>

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { to: '/student/certificates', label: 'Chứng nhận' }, { label: data.courseId?.courseName || 'Chứng nhận' }]}
        title="Chứng nhận hoàn thành khóa học"
        description={data.courseId?.courseName}
      />

      <div className="card card-body max-w-2xl mx-auto border-2 border-amber-200 bg-gradient-to-b from-amber-50 to-white text-center py-10 px-8">
        <FaCertificate className="text-5xl text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-1">Chứng nhận</h2>
        <p className="text-slate-600 mb-6">Xác nhận học viên đã hoàn thành khóa học</p>
        <h3 className="text-2xl font-bold text-cyan-700 mb-2">{data.studentName}</h3>
        <p className="text-lg text-slate-700 mb-2">{data.courseId?.courseName}</p>
        {data.classId?.className && <p className="text-slate-500 text-sm">Lớp: {data.classId.className}</p>}
        <p className="text-slate-500 text-sm mt-4">Ngày cấp: {new Date(data.completedAt).toLocaleDateString('vi')}</p>
        <Link to="/student/certificates" className="mt-6 inline-block text-cyan-600 hover:underline">← Danh sách chứng nhận</Link>
      </div>
    </div>
  )
}
