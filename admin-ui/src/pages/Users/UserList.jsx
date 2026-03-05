import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import Pagination from '../../components/ui/Pagination'

const ROLE_LABEL = { admin: 'Admin', staff: 'Giáo vụ', teacher: 'Giảng viên', student: 'Học viên' }

export default function UserList() {
    const [list, setList] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [loading, setLoading] = useState(true)
    const [roleFilter, setRoleFilter] = useState('')

    useEffect(() => {
        setLoading(true)
        const params = { page: page - 1, size: pageSize }
        if (roleFilter) params.role = roleFilter
        axiosClient.get('/users', { params })
            .then((res) => {
                setList(res.data.data || [])
                setTotal(res.data.total ?? 0)
            })
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }, [roleFilter, page, pageSize])

    const handleSendCredentials = (id) => {
        axiosClient.post(`/users/${id}/send-credentials`)
            .then(() => ToastMessage.success('Đã gửi email thông tin đăng nhập'))
            .catch(ToastMessage.error)
    }

    if (loading) return <div className="p-4">Đang tải...</div>

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Danh sách người dùng</h1>
            <div className="mb-4">
                <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
                    className="border rounded px-3 py-2">
                    <option value="">Tất cả vai trò</option>
                    {Object.entries(ROLE_LABEL).map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                    ))}
                </select>
            </div>
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="text-left p-2">Họ tên</th>
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">SĐT</th>
                            <th className="text-left p-2">Vai trò</th>
                            <th className="p-2">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((u) => (
                            <tr key={u._id} className="border-b hover:bg-gray-50">
                                <td className="p-2">{u.fullName}</td>
                                <td className="p-2">{u.email}</td>
                                <td className="p-2">{u.phoneNumber}</td>
                                <td className="p-2">{ROLE_LABEL[u.role] || u.role}</td>
                                <td className="p-2">
                                    <Link to={`/dashboard/users/${u._id}`} className="text-orange-600 hover:underline text-xs mr-2">Chi tiết</Link>
                                    <button type="button" onClick={() => handleSendCredentials(u._id)}
                                        className="text-orange-600 hover:underline text-xs">Gửi TK/MK</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
        </div>
    )
}
