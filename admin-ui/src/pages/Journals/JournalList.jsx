import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaPenFancy } from 'react-icons/fa'

export default function JournalList() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [journals, setJournals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get('/classes', { params: { limit: 100 } }).then((res) => setClasses(res.data.data || [])).catch(ToastMessage.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedClass) { setJournals([]); return }
    axiosClient.get(`/journals/classes/${selectedClass}/journals`, { params: { limit: 50 } }).then((res) => setJournals(res.data.data || [])).catch(ToastMessage.error)
  }, [selectedClass])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader breadcrumbs={[{ to: '/dashboard', label: 'Tổng quan' }, { label: 'Nhật ký' }]} title="Nhật ký lớp" description="Casestudy #8: Nhật ký hàng ngày do giảng viên ghi cho từng lớp." />
      <div className="card overflow-hidden">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center"><FaPenFancy className="text-lg" /></div>
            <div><h2 className="font-bold text-slate-800">Chọn lớp</h2><p className="text-sm text-slate-500">Xem nhật ký lớp do GV ghi</p></div>
          </div>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-2.5 w-full max-w-md">
            <option value="">-- Chọn lớp --</option>
            {classes.map((c) => <option key={c._id} value={c._id}>{c.className} ({c.classCode})</option>)}
          </select>
        </div>
      </div>
      {selectedClass && (
        <div className="card overflow-hidden">
          <div className="card-body">
            <h2 className="font-bold text-slate-800 mb-4">Lịch sử nhật ký</h2>
            {journals.length === 0 ? <p className="text-slate-400 py-4">Chưa có nhật ký.</p> : (
              <ul className="space-y-3">
                {journals.map((j) => (
                  <li key={j._id} className="flex gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-500 shrink-0">{new Date(j.createdAt).toLocaleString('vi-VN')}</span>
                    <span className="font-medium text-slate-700">{j.teacherId?.fullName}</span>
                    <span className="text-slate-800">{j.content}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
