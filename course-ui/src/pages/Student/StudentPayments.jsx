import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Pagination from '../../components/ui/Pagination'
import { FaMoneyBillWave } from 'react-icons/fa'

const PAYMENT_STATUS_LABEL = { paid: 'Đã đóng', unpaid: 'Nợ học phí', overdue: 'Quá hạn', pending: 'Chờ thanh toán' }
const PAYMENT_BADGE = { paid: 'success', unpaid: 'danger', overdue: 'danger', pending: 'warning' }

export default function StudentPayments() {
    const [user, setUser] = useState(null)
    const [list, setList] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const u = JSON.parse(localStorage.getItem('user') || '{}')
        if (u.id) setUser(u)
        else setLoading(false)
    }, [])

    useEffect(() => {
        if (!user?.id) return
        setLoading(true)
        axiosClient.get(`/payments/students/${user.id}/payments`, { params: { page: page - 1, size: pageSize } })
            .then((res) => {
                setList(res.data.data || [])
                setTotal(res.data.total ?? 0)
            })
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }, [user?.id, page, pageSize])

    if (loading) return <LoadingSpinner />

    return (
        <div className="space-y-8">
            <PageHeader breadcrumbs={[{ to: '/student', label: 'Trang chủ' }, { label: 'Lịch sử học phí' }]} title="Lịch sử học phí" description="Xem lại các đợt nộp học phí và tình trạng thanh toán." />
            {list.length === 0 ? (
                <div className="card">
                    <EmptyState icon={FaMoneyBillWave} title="Chưa có lịch sử học phí" description="Các đợt nộp học phí của bạn sẽ hiển thị tại đây sau khi được trung tâm tạo." />
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80">
                                    <th className="text-left py-4 px-5 font-semibold text-slate-700">Lớp</th>
                                    <th className="text-left py-4 px-5 font-semibold text-slate-700">Hạn nộp</th>
                                    <th className="text-right py-4 px-5 font-semibold text-slate-700">Số tiền</th>
                                    <th className="text-left py-4 px-5 font-semibold text-slate-700">Trạng thái</th>
                                    <th className="text-left py-4 px-5 font-semibold text-slate-700">Ngày đóng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((p) => (
                                    <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-5 font-medium text-slate-800">{p.classId?.className || '—'}</td>
                                        <td className="py-4 px-5 text-slate-600">{p.dueDate ? new Date(p.dueDate).toLocaleDateString('vi-VN') : '—'}</td>
                                        <td className="py-4 px-5 text-right font-medium text-slate-800">{p.amount != null ? `${p.amount.toLocaleString()} VNĐ` : '—'}</td>
                                        <td className="py-4 px-5"><Badge variant={PAYMENT_BADGE[p.status] || 'neutral'}>{PAYMENT_STATUS_LABEL[p.status] || p.status}</Badge></td>
                                        <td className="py-4 px-5 text-slate-600">{p.paidDate ? new Date(p.paidDate).toLocaleDateString('vi-VN') : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        page={page}
                        total={total}
                        pageSize={pageSize}
                        onPageChange={setPage}
                        onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
                    />
                </div>
            )}
        </div>
    )
}
