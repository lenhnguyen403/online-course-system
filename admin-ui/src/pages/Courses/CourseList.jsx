import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import Pagination from '../../components/ui/Pagination'

export default function CourseList() {
    const [list, setList] = useState([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        axiosClient.get('/courses', { params: { page: page - 1, size: pageSize } })
            .then((res) => {
                setList(res.data.data || [])
                setTotal(res.data.total ?? 0)
            })
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }, [page, pageSize])

    if (loading) return <div className="p-4">Đang tải...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Khóa học</h1>
                <Link to="/dashboard/courses/create" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Thêm khóa học</Link>
            </div>
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="text-left p-2">Mã khóa</th>
                            <th className="text-left p-2">Tên khóa học</th>
                            <th className="text-left p-2">Môn học</th>
                            <th className="text-right p-2">Thời lượng (tháng)</th>
                            <th className="text-right p-2">Học phí</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((c) => (
                            <tr key={c._id} className="border-b hover:bg-gray-50">
                                <td className="p-2">{c.courseCode}</td>
                                <td className="p-2">{c.courseName}</td>
                                <td className="p-2">{c.subjectId?.subjectName || '-'}</td>
                                <td className="p-2 text-right">{c.durationInMonths}</td>
                                <td className="p-2 text-right">{c.tuitionFee != null ? c.tuitionFee.toLocaleString() : '-'}</td>
                                <td className="p-2"><Link to={`/dashboard/courses/${c._id}`} className="text-orange-600 hover:underline">Chi tiết</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
        </div>
    )
}
