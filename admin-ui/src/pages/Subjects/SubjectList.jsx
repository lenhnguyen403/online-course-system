import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Pagination from '../../components/ui/Pagination'
import { FaBook } from 'react-icons/fa'

export default function SubjectList() {
  const [list, setList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ subjectCode: '', subjectName: '' })

  const load = () => {
    setLoading(true)
    axiosClient.get('/subjects', { params: { page: page - 1, size: pageSize } })
      .then((res) => { setList(res.data.data || []); setTotal(res.data.total ?? 0) })
      .catch(ToastMessage.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => load(), [page, pageSize])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.subjectCode?.trim() || !form.subjectName?.trim()) {
            ToastMessage.error('Mã môn và Tên môn là bắt buộc')
            return
        }
        axiosClient.post('/subjects', form)
            .then(() => {
                ToastMessage.success('Thêm môn học thành công')
                setForm({ subjectCode: '', subjectName: '' })
                setShowForm(false)
                setPage(1)
                load()
            })
            .catch(ToastMessage.error)
    }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ to: '/dashboard', label: 'Tổng quan' }, { label: 'Môn học' }]} title="Môn học" description="Casestudy #21: Thêm môn học (SubjectId, SubjectName)." action={<button type="button" onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600">{showForm ? 'Đóng form' : 'Thêm môn học'}</button>} />
      {showForm && (
        <form onSubmit={handleSubmit} className="card overflow-hidden max-w-md">
          <div className="card-body grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Mã môn (SubjectId) *</label><input type="text" value={form.subjectCode} onChange={(e) => setForm({ ...form, subjectCode: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5" required /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Tên môn *</label><input type="text" value={form.subjectName} onChange={(e) => setForm({ ...form, subjectName: e.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-2.5" required /></div>
            <div className="sm:col-span-2"><button type="submit" className="px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600">Thêm</button></div>
          </div>
        </form>
      )}
      <div className="card overflow-hidden">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center"><FaBook className="text-lg" /></div>
            <div><h2 className="font-bold text-slate-800">Danh sách môn học</h2><p className="text-sm text-slate-500">Các môn học của trung tâm</p></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-200 bg-slate-50/80"><th className="text-left py-3 px-4 font-semibold text-slate-700">Mã môn</th><th className="text-left py-3 px-4 font-semibold text-slate-700">Tên môn</th></tr></thead>
              <tbody>
                {list.map((s) => (
                  <tr key={s._id} className="border-b border-slate-100 hover:bg-slate-50/50"><td className="py-3 px-4 font-medium text-slate-800">{s.subjectCode}</td><td className="py-3 px-4 text-slate-600">{s.subjectName}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
        </div>
      </div>
    </div>
  )
}
