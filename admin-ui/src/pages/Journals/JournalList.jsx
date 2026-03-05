import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Pagination from '../../components/ui/Pagination'
import { FaPenFancy } from 'react-icons/fa'

export default function JournalList() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [journals, setJournals] = useState([])
  const [journalTotal, setJournalTotal] = useState(0)
  const [journalPage, setJournalPage] = useState(1)
  const [journalPageSize, setJournalPageSize] = useState(10)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axiosClient.get('/classes', { params: { page: 0, size: 500 } }).then((res) => setClasses(res.data.data || [])).catch(ToastMessage.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedClass) { setJournals([]); setJournalTotal(0); return }
    axiosClient.get(`/journals/classes/${selectedClass}/journals`, { params: { page: journalPage - 1, size: journalPageSize } })
      .then((res) => { setJournals(res.data.data || []); setJournalTotal(res.data.total ?? 0) })
      .catch(ToastMessage.error)
  }, [selectedClass, journalPage, journalPageSize])

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
          <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); setJournalPage(1) }} className="rounded-xl border border-slate-200 px-4 py-2.5 w-full max-w-md">
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
              <>
                <ul className="space-y-3">
                  {journals.map((j) => (
                    <li key={j._id} className="flex gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-xs text-slate-500 shrink-0">{new Date(j.createdAt).toLocaleString('vi-VN')}</span>
                      <span className="font-medium text-slate-700">{j.teacherId?.fullName}</span>
                      <span className="text-slate-800">{j.content}</span>
                    </li>
                  ))}
                </ul>
                <Pagination page={journalPage} total={journalTotal} pageSize={journalPageSize} onPageChange={setJournalPage} onPageSizeChange={(s) => { setJournalPageSize(s); setJournalPage(1) }} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
