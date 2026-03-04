import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

const PAYMENT_STATUS_LABEL = { paid: 'Đã đóng', unpaid: 'Nợ học phí', overdue: 'Quá hạn', pending: 'Chờ thanh toán' }

export default function StudentDashboard() {
    const [user, setUser] = useState(null)
    const [nextPayment, setNextPayment] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user') || '{}')
        if (!u.id) {
            setLoading(false)
            return
        }
        setUser(u)
        axiosClient.get(`/payments/students/${u.id}/next-payment`)
            .then((res) => setNextPayment(res.data))
            .catch(() => setNextPayment(null))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-slate-800">Trang chủ học viên</h1>
            <section className="card">
                <div className="card-body">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Tình trạng học phí</h2>
                    {nextPayment ? (
                        <div className="grid gap-2 text-sm">
                            <div><span className="text-slate-500">Đợt nộp tiếp theo:</span> <span className="text-slate-800 font-medium">{nextPayment.classId?.className || '-'}</span></div>
                            <div><span className="text-slate-500">Hạn:</span> {nextPayment.dueDate ? new Date(nextPayment.dueDate).toLocaleDateString('vi-VN') : '-'}</div>
                            <div><span className="text-slate-500">Tình trạng:</span> <span className="font-medium">{PAYMENT_STATUS_LABEL[nextPayment.status] || nextPayment.status}</span></div>
                            <div><span className="text-slate-500">Số tiền:</span> {nextPayment.amount != null ? nextPayment.amount.toLocaleString() : '-'} VNĐ</div>
                        </div>
                    ) : (
                        <p className="text-slate-500">Không có đợt nộp học phí đang chờ.</p>
                    )}
                </div>
            </section>
            <div className="flex flex-wrap gap-3">
                <Link to="/student/payments" className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold bg-cyan-500 text-white hover:bg-cyan-600 shadow-md shadow-cyan-500/20 transition-all">Lịch sử học phí</Link>
                <Link to="/student/exams" className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all">Xem điểm thi</Link>
            </div>
        </div>
    )
}
