import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function TeacherDashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient.get('/dashboard/teacher')
            .then((res) => setData(res.data))
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" /></div>

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-slate-800">Tổng quan giảng viên</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="card card-body">
                    <div className="text-slate-500 text-sm font-medium">Số lớp đang dạy</div>
                    <div className="text-3xl font-bold text-rose-600 mt-1">{data?.totalClasses ?? 0}</div>
                </div>
                <div className="card card-body">
                    <div className="text-slate-500 text-sm font-medium">Tổng học viên</div>
                    <div className="text-3xl font-bold text-rose-600 mt-1">{data?.totalStudents ?? 0}</div>
                </div>
            </div>
            <section>
                <h2 className="text-lg font-bold text-slate-800 mb-4">Lớp của tôi</h2>
                <div className="grid gap-3">
                    {(data?.classes || []).slice(0, 5).map((c) => (
                        <Link key={c._id} to={`/teacher/classes/${c._id}`} className="card card-body hover:shadow-md hover:border-rose-200 transition-all">
                            <div className="font-semibold text-slate-800">{c.className}</div>
                            <div className="text-sm text-slate-500">{c.classCode} · {c.courseId?.courseName || '-'}</div>
                        </Link>
                    ))}
                </div>
                {(data?.classes?.length || 0) > 5 && <Link to="/teacher/classes" className="inline-block mt-3 text-rose-600 font-medium hover:underline">Xem tất cả lớp →</Link>}
            </section>
        </div>
    )
}
