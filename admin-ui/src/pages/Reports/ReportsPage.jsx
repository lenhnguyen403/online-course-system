import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function ReportsPage() {
    const [teacherStats, setTeacherStats] = useState([])
    const [classScores, setClassScores] = useState([])
    const [selectedClass, setSelectedClass] = useState('')
    const [scoreChart, setScoreChart] = useState([])
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient.get('/dashboard/admin').then((res) => {
            setTeacherStats(res.data.teacherStats || [])
        }).catch(ToastMessage.error)
        axiosClient.get('/dashboard/class').then((res) => {
            setClassScores(res.data.classes || [])
            setClasses(res.data.classes || [])
        }).catch(ToastMessage.error).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (!selectedClass) { setScoreChart([]); return }
        axiosClient.get(`/dashboard/class/${selectedClass}/score-chart`).then((res) => setScoreChart(res.data.data || [])).catch(ToastMessage.error)
    }, [selectedClass])

    if (loading) return <div className="p-4">Đang tải...</div>

    return (
        <div className="space-y-8">
            <h1 className="text-xl font-bold">Báo cáo & Thống kê</h1>

            <section className="bg-white rounded shadow p-6">
                <h2 className="font-bold mb-4">Số lượng học viên theo giảng viên</h2>
                <table className="w-full text-sm">
                    <thead><tr className="border-b bg-gray-50"><th className="text-left p-2">Giảng viên</th><th className="text-right p-2">Số lớp</th><th className="text-right p-2">Số HV</th></tr></thead>
                    <tbody>
                        {teacherStats.map((t) => (
                            <tr key={t.teacherId} className="border-b"><td className="p-2">{t.teacherName}</td><td className="p-2 text-right">{t.totalClasses}</td><td className="p-2 text-right">{t.totalStudents}</td></tr>
                        ))}
                    </tbody>
                </table>
                {teacherStats.length === 0 && <p className="text-gray-400">Chưa có dữ liệu.</p>}
            </section>

            <section className="bg-white rounded shadow p-6">
                <h2 className="font-bold mb-4">Điểm trung bình theo lớp</h2>
                <table className="w-full text-sm">
                    <thead><tr className="border-b bg-gray-50"><th className="text-left p-2">Lớp</th><th className="text-right p-2">Số HV</th><th className="text-right p-2">Điểm TB</th></tr></thead>
                    <tbody>
                        {classScores.map((c) => (
                            <tr key={c._id} className="border-b"><td className="p-2">{c.className}</td><td className="p-2 text-right">{c.studentCount ?? 0}</td><td className="p-2 text-right">{(c.averageScore ?? 0).toFixed(2)}</td></tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className="bg-white rounded shadow p-6">
                <h2 className="font-bold mb-4">Biểu đồ điểm từng học viên trong lớp</h2>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="border rounded px-3 py-2 mb-4">
                    <option value="">-- Chọn lớp --</option>
                    {classes.map((c) => <option key={c._id} value={c._id}>{c.className}</option>)}
                </select>
                {selectedClass && (
                    <table className="w-full text-sm">
                        <thead><tr className="border-b bg-gray-50"><th className="text-left p-2">Học viên</th><th className="text-right p-2">Điểm TB</th></tr></thead>
                        <tbody>
                            {scoreChart.map((r) => (
                                <tr key={r.studentId} className="border-b"><td className="p-2">{r.fullName}</td><td className="p-2 text-right">{r.averageScore}</td></tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {selectedClass && scoreChart.length === 0 && <p className="text-gray-400">Chưa có điểm.</p>}
            </section>
        </div>
    )
}
