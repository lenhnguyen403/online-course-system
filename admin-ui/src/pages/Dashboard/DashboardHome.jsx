import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'
import PageHeader from '../../components/ui/PageHeader'
import StatCard from '../../components/ui/StatCard'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import { FaUsers, FaChalkboardTeacher, FaBookOpen, FaUserGraduate } from 'react-icons/fa'

export default function DashboardHome() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient.get('/dashboard/admin')
            .then((res) => setData(res.data))
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <LoadingSpinner />
    if (!data) return null

    return (
        <div className="space-y-8">
            <PageHeader breadcrumbs={[{ label: 'Tổng quan' }]} title="Tổng quan hệ thống" description="Thống kê người dùng, lớp học và học viên theo giảng viên." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <StatCard icon={FaUsers} label="Tổng người dùng" value={data.totalUsers} variant="orange" />
                <StatCard icon={FaBookOpen} label="Tổng lớp học" value={data.totalClasses} variant="orange" />
                <StatCard icon={FaUserGraduate} label="Tổng đăng ký" value={data.totalEnrollments} variant="orange" />
            </div>
            {data.teacherStats && data.teacherStats.length > 0 && (
                <div className="card overflow-hidden">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                                <FaChalkboardTeacher className="text-lg" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Số lượng học viên theo giảng viên</h2>
                                <p className="text-sm text-slate-500">Casestudy #17</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/80">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Giảng viên</th>
                                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Số lớp</th>
                                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Số HV</th>
                                    </tr>
                                </thead>
                            <tbody>
                                {data.teacherStats.map((t) => (
                                    <tr key={t.teacherId} className="border-b border-slate-100 hover:bg-slate-50/50 last:border-0">
                                        <td className="py-3 px-4 font-medium text-slate-800">{t.teacherName}</td>
                                        <td className="py-3 px-4 text-right text-slate-600">{t.totalClasses}</td>
                                        <td className="py-3 px-4 text-right text-slate-600">{t.totalStudents}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
