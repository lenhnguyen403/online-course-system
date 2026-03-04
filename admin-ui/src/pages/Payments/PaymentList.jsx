import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaMoneyBillWave, FaCheckCircle, FaClock } from 'react-icons/fa'

export default function PaymentList() {
    const [summary, setSummary] = useState(null)
    const [recent, setRecent] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            axiosClient.get('/reports/financial').then((res) => setSummary(res.data)).catch(() => setSummary({})),
            axiosClient.get('/dashboard/admin').then((res) => setRecent(res.data.recentPayments || [])).catch(() => setRecent([]))
        ]).finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingSpinner />

    return (
        <div className="space-y-8">
            <PageHeader breadcrumbs={[{ to: '/dashboard', label: 'Tổng quan' }, { label: 'Học phí' }]} title="Học phí & Tài chính" description="Tình trạng thu học phí và giao dịch gần đây." action={<Link to="/dashboard/payments/create" className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600">Tạo đợt thu</Link>} />
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <StatCard icon={FaCheckCircle} label="Đã thu (số đợt)" value={summary.paidCount ?? 0} sub={`${(summary.totalPaid ?? 0).toLocaleString()} VNĐ`} variant="emerald" />
                    <StatCard icon={FaClock} label="Chưa thu (số đợt)" value={summary.unpaidCount ?? 0} sub={`${(summary.totalUnpaid ?? 0).toLocaleString()} VNĐ`} variant="orange" />
                </div>
            )}
            <div className="card overflow-hidden">
                <div className="card-body">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center"><FaMoneyBillWave className="text-lg" /></div>
                        <div><h2 className="font-bold text-slate-800">Gần đây đã thu</h2><p className="text-sm text-slate-500">Các giao dịch học phí mới nhất</p></div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-slate-200 bg-slate-50/80"><th className="text-left py-3 px-4 font-semibold text-slate-700">Học viên</th><th className="text-left py-3 px-4 font-semibold text-slate-700">Lớp</th><th className="text-right py-3 px-4 font-semibold text-slate-700">Số tiền</th><th className="text-left py-3 px-4 font-semibold text-slate-700">Ngày đóng</th></tr></thead>
                            <tbody>
                                {recent.map((p) => (
                                    <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                        <td className="py-3 px-4 font-medium text-slate-800">{p.studentId?.fullName || '—'}</td>
                                        <td className="py-3 px-4 text-slate-600">{p.classId?.className || '—'}</td>
                                        <td className="py-3 px-4 text-right font-medium">{p.amount != null ? `${p.amount.toLocaleString()} VNĐ` : '—'}</td>
                                        <td className="py-3 px-4 text-slate-600">{p.paidDate ? new Date(p.paidDate).toLocaleDateString('vi-VN') : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {recent.length === 0 && <p className="text-slate-400 py-6 text-center text-sm">Chưa có giao dịch gần đây.</p>}
                </div>
            </div>
        </div>
    )
}
