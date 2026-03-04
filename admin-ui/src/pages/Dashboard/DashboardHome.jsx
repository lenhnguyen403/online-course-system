import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function DashboardHome() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient.get('/dashboard/admin')
            .then((res) => setData(res.data))
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="flex items-center justify-center py-12"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
    if (!data) return null

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-slate-800">Tổng quan</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="card card-body">
                    <div className="text-slate-500 text-sm font-medium">Tổng người dùng</div>
                    <div className="text-2xl font-bold text-slate-800 mt-1">{data.totalUsers}</div>
                </div>
                <div className="card card-body">
                    <div className="text-slate-500 text-sm font-medium">Tổng lớp học</div>
                    <div className="text-2xl font-bold text-slate-800 mt-1">{data.totalClasses}</div>
                </div>
                <div className="card card-body">
                    <div className="text-slate-500 text-sm font-medium">Tổng đăng ký</div>
                    <div className="text-2xl font-bold text-slate-800 mt-1">{data.totalEnrollments}</div>
                </div>
            </div>
            {data.teacherStats && data.teacherStats.length > 0 && (
                <div className="card overflow-hidden">
                    <div className="card-body">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Số lượng học viên theo giảng viên</h2>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 text-slate-600 font-medium">Giảng viên</th>
                                    <th className="text-right py-3 text-slate-600 font-medium">Số lớp</th>
                                    <th className="text-right py-3 text-slate-600 font-medium">Số HV</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.teacherStats.map((t) => (
                                    <tr key={t.teacherId} className="border-b border-slate-100 last:border-0">
                                        <td className="py-3 text-slate-800">{t.teacherName}</td>
                                        <td className="py-3 text-right text-slate-600">{t.totalClasses}</td>
                                        <td className="py-3 text-right text-slate-600">{t.totalStudents}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
