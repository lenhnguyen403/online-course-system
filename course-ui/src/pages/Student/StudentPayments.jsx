import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

const PAYMENT_STATUS_LABEL = { paid: 'Đã đóng', unpaid: 'Nợ học phí', overdue: 'Quá hạn', pending: 'Chờ thanh toán' }

export default function StudentPayments() {
    const [user, setUser] = useState(null)
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user') || '{}')
        if (!u.id) {
            setLoading(false)
            return
        }
        setUser(u)
        axiosClient.get(`/payments/students/${u.id}/payments`, { params: { limit: 50 } })
            .then((res) => setList(res.data.data || []))
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="p-4">Đang tải...</div>

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Lịch sử học phí</h1>
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="text-left p-2">Lớp</th>
                            <th className="text-left p-2">Hạn nộp</th>
                            <th className="text-left p-2">Số tiền</th>
                            <th className="text-left p-2">Trạng thái</th>
                            <th className="text-left p-2">Ngày đóng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((p) => (
                            <tr key={p._id} className="border-b">
                                <td className="p-2">{p.classId?.className || '-'}</td>
                                <td className="p-2">{p.dueDate ? new Date(p.dueDate).toLocaleDateString('vi-VN') : '-'}</td>
                                <td className="p-2">{p.amount != null ? p.amount.toLocaleString() : '-'}</td>
                                <td className="p-2">{PAYMENT_STATUS_LABEL[p.status] || p.status}</td>
                                <td className="p-2">{p.paidDate ? new Date(p.paidDate).toLocaleDateString('vi-VN') : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {list.length === 0 && <p className="text-gray-500 mt-2">Chưa có lịch sử.</p>}
        </div>
    )
}
