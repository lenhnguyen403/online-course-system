import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function ReportsPage() {
  const [teacherStats, setTeacherStats] = useState([])
  const [classScores, setClassScores] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [scoreChart, setScoreChart] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get('/dashboard/admin').then((res) => setTeacherStats(res.data.teacherStats || [])).catch(ToastMessage.error)
    axiosClient.get('/dashboard/class').then((res) => {
      setClassScores(res.data.classes || [])
      setClasses(res.data.classes || [])
    }).catch(ToastMessage.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedClass) { setScoreChart([]); return }
    axiosClient.get(`/dashboard/class/${selectedClass}/score-chart`).then((res) => setScoreChart(res.data.data || [])).catch(ToastMessage.error)
  }, [selectedClass])

  if (loading) return <LoadingSpinner />

  const chartData = scoreChart.map((r) => ({ name: r.fullName?.slice(0, 12) || '—', score: Number(r.averageScore) || 0 }))

  return (
    <div className="space-y-8">
      <PageHeader breadcrumbs={[{ to: '/dashboard', label: 'Tổng quan' }, { label: 'Báo cáo' }]} title="Báo cáo & Thống kê" description="Casestudy #17–19: HV theo GV, điểm TB lớp, biểu đồ điểm từng HV trong lớp." />

      <div className="card overflow-hidden">
        <div className="card-body">
          <h2 className="font-bold text-slate-800 mb-4">Số lượng học viên theo giảng viên (#17)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-200 bg-slate-50/80"><th className="text-left py-3 px-4 font-semibold text-slate-700">Giảng viên</th><th className="text-right py-3 px-4 font-semibold text-slate-700">Số lớp</th><th className="text-right py-3 px-4 font-semibold text-slate-700">Số HV</th></tr></thead>
              <tbody>
                {teacherStats.map((t) => (
                  <tr key={t.teacherId} className="border-b border-slate-100 hover:bg-slate-50/50"><td className="py-3 px-4 font-medium text-slate-800">{t.teacherName}</td><td className="py-3 px-4 text-right text-slate-600">{t.totalClasses}</td><td className="py-3 px-4 text-right text-slate-600">{t.totalStudents}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          {teacherStats.length === 0 && <p className="text-slate-400 py-4">Chưa có dữ liệu.</p>}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="card-body">
          <h2 className="font-bold text-slate-800 mb-4">Điểm trung bình theo lớp (#18)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-slate-200 bg-slate-50/80"><th className="text-left py-3 px-4 font-semibold text-slate-700">Lớp</th><th className="text-right py-3 px-4 font-semibold text-slate-700">Số HV</th><th className="text-right py-3 px-4 font-semibold text-slate-700">Điểm TB</th></tr></thead>
              <tbody>
                {classScores.map((c) => (
                  <tr key={c._id} className="border-b border-slate-100 hover:bg-slate-50/50"><td className="py-3 px-4 font-medium text-slate-800">{c.className}</td><td className="py-3 px-4 text-right text-slate-600">{c.studentCount ?? 0}</td><td className="py-3 px-4 text-right font-medium text-slate-800">{(c.averageScore ?? 0).toFixed(2)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="card-body">
          <h2 className="font-bold text-slate-800 mb-4">Biểu đồ điểm từng học viên trong lớp (#19)</h2>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-2.5 mb-4">
            <option value="">-- Chọn lớp --</option>
            {classes.map((c) => <option key={c._id} value={c._id}>{c.className}</option>)}
          </select>
          {selectedClass && chartData.length > 0 && (
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => [v, 'Điểm TB']} />
                  <Bar dataKey="score" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          {selectedClass && scoreChart.length === 0 && <p className="text-slate-400 py-4">Chưa có điểm.</p>}
        </div>
      </div>
    </div>
  )
}
