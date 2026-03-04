import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function StudentClasses() {
    const [enrollments, setEnrollments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient.get('/me/classes', { params: { limit: 50 } })
            .then((res) => setEnrollments(res.data.data || []))
            .catch(() => {
                axiosClient.get('/dashboard/student').then((res) => setEnrollments(res.data.enrollments || [])).catch(ToastMessage.error)
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="p-4">Đang tải...</div>

    const list = Array.isArray(enrollments) ? enrollments : []

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Lớp học của tôi</h1>
            <div className="grid gap-3">
                {list.map((c) => (
                    <div key={c._id} className="p-4 bg-white rounded shadow">
                        <div className="font-medium">{c.className || 'Lớp'}</div>
                        <div className="text-sm text-gray-500">{c.classCode || ''} · {c.courseId?.courseName || ''}</div>
                    </div>
                ))}
            </div>
            {list.length === 0 && <p className="text-gray-500">Bạn chưa đăng ký lớp nào.</p>}
        </div>
    )
}
