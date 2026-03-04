import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function TeacherClassList() {
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient.get('/classes', { params: { limit: 50 } })
            .then((res) => setClasses(res.data.data || []))
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="p-4">Đang tải...</div>

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Danh sách lớp học của tôi</h1>
            <div className="grid gap-3">
                {classes.map((c) => (
                    <Link key={c._id} to={`/teacher/classes/${c._id}`}
                        className="block p-4 bg-white rounded shadow hover:shadow-md transition">
                        <div className="font-medium">{c.className}</div>
                        <div className="text-sm text-gray-500">{c.classCode} · {c.courseId?.courseName || '-'}</div>
                    </Link>
                ))}
            </div>
            {classes.length === 0 && <p className="text-gray-500">Chưa có lớp nào.</p>}
        </div>
    )
}
