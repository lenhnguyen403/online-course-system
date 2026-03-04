import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

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

    if (loading) return <div className="p-4">Đang tải...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Học phí & Tài chính</h1>
                <Link to="/dashboard/payments/create" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Tạo đợt thu</Link>
            </div>
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded shadow"><div className="text-gray-500 text-sm">Đã thu (số đợt)</div><div className="text-xl font-bold">{summary.paidCount ?? 0}</div><div className="text-sm">{(summary.totalPaid ?? 0).toLocaleString()} VNĐ</div></div>
                    <div className="bg-white p-4 rounded shadow"><div className="text-gray-500 text-sm">Chưa thu (số đợt)</div><div className="text-xl font-bold">{summary.unpaidCount ?? 0}</div><div className="text-sm">{(summary.totalUnpaid ?? 0).toLocaleString()} VNĐ</div></div>
                </div>
            )}
            <div className="bg-white rounded shadow p-6">
                <h2 className="font-bold mb-2">Gần đây đã thu</h2>
                <table className="w-full text-sm">
                    <thead><tr className="border-b bg-gray-50"><th className="text-left p-2">Học viên</th><th className="text-left p-2">Lớp</th><th className="text-right p-2">Số tiền</th><th className="text-left p-2">Ngày đóng</th></tr></thead>
                    <tbody>
                        {recent.map((p) => (
                            <tr key={p._id} className="border-b">
                                <td className="p-2">{p.studentId?.fullName || '-'}</td>
                                <td className="p-2">{p.classId?.className || '-'}</td>
                                <td className="p-2 text-right">{p.amount != null ? p.amount.toLocaleString() : '-'}</td>
                                <td className="p-2">{p.paidDate ? new Date(p.paidDate).toLocaleDateString('vi-VN') : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {recent.length === 0 && <p className="text-gray-400 py-2">Chưa có giao dịch gần đây.</p>}
            </div>
        </div>
    )
}
