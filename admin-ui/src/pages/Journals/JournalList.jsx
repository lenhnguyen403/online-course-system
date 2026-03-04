import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function JournalList() {
    const [classes, setClasses] = useState([])
    const [selectedClass, setSelectedClass] = useState('')
    const [journals, setJournals] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient.get('/classes', { params: { limit: 100 } }).then((res) => setClasses(res.data.data || [])).catch(ToastMessage.error).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        if (!selectedClass) { setJournals([]); return }
        axiosClient.get(`/journals/classes/${selectedClass}/journals`, { params: { limit: 50 } })
            .then((res) => setJournals(res.data.data || []))
            .catch(ToastMessage.error)
    }, [selectedClass])

    if (loading) return <div className="p-4">Đang tải...</div>

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Nhật ký lớp</h1>
            <div className="mb-4">
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="border rounded px-3 py-2">
                    <option value="">-- Chọn lớp --</option>
                    {classes.map((c) => <option key={c._id} value={c._id}>{c.className} ({c.classCode})</option>)}
                </select>
            </div>
            <div className="bg-white rounded shadow p-6">
                {selectedClass ? (
                    <ul className="space-y-3">
                        {journals.map((j) => (
                            <li key={j._id} className="border-b pb-2 text-sm">
                                <span className="text-gray-500">{new Date(j.createdAt).toLocaleString('vi-VN')}</span> · <strong>{j.teacherId?.fullName}</strong>: {j.content}
                            </li>
                        ))}
                        {journals.length === 0 && <li className="text-gray-400">Chưa có nhật ký.</li>}
                    </ul>
                ) : (
                    <p className="text-gray-500">Chọn một lớp để xem nhật ký.</p>
                )}
            </div>
        </div>
    )
}
