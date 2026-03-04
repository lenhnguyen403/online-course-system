import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

export default function ClassList() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get('/classes', { params: { limit: 50 } }).then((res) => setList(res.data.data || [])).catch(ToastMessage.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ to: '/dashboard', label: 'Tổng quan' }, { label: 'Lớp học' }]}
        title="Lớp học"
        description="Quản lý lớp học, phân công giảng viên và học viên."
        action={<Link to="/dashboard/classes/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600">Thêm lớp</Link>}
      />
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="text-left py-4 px-5 font-semibold text-slate-700">Mã lớp</th>
                <th className="text-left py-4 px-5 font-semibold text-slate-700">Tên lớp</th>
                <th className="text-left py-4 px-5 font-semibold text-slate-700">Khóa học</th>
                <th className="text-left py-4 px-5 font-semibold text-slate-700">Trạng thái</th>
                <th className="text-right py-4 px-5 font-semibold text-slate-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={c._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                  <td className="py-4 px-5 font-medium text-slate-800">{c.classCode}</td>
                  <td className="py-4 px-5 text-slate-800">{c.className}</td>
                  <td className="py-4 px-5 text-slate-600">{c.courseId?.courseName || '—'}</td>
                  <td className="py-4 px-5 text-slate-600">{c.status || '—'}</td>
                  <td className="py-4 px-5 text-right"><Link to={`/dashboard/classes/${c._id}`} className="text-orange-600 font-medium hover:underline">Chi tiết</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
