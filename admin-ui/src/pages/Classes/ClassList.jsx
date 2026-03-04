import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function ClassList() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient.get('/classes', { params: { limit: 50 } })
            .then((res) => {
                setList(res.data.data || [])
            })
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="p-4">Đang tải...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Lớp học</h1>
                <Link to="/dashboard/classes/create" className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">Thêm lớp</Link>
            </div>
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="text-left p-2">Mã lớp</th>
                            <th className="text-left p-2">Tên lớp</th>
                            <th className="text-left p-2">Khóa học</th>
                            <th className="text-left p-2">Trạng thái</th>
                            <th className="p-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((c) => (
                            <tr key={c._id} className="border-b hover:bg-gray-50">
                                <td className="p-2">{c.classCode}</td>
                                <td className="p-2">{c.className}</td>
                                <td className="p-2">{c.courseId?.courseName || '-'}</td>
                                <td className="p-2">{c.status || '-'}</td>
                                <td className="p-2"><Link to={`/dashboard/classes/${c._id}`} className="text-orange-600 hover:underline">Chi tiết</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
