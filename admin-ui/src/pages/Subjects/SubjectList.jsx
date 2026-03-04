import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function SubjectList() {
    const [list, setList] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ subjectCode: '', subjectName: '' })

    const load = () => {
        setLoading(true)
        axiosClient.get('/subjects', { params: { limit: 100 } })
            .then((res) => setList(res.data.data || []))
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => load(), [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.subjectCode?.trim() || !form.subjectName?.trim()) {
            ToastMessage.error('Mã môn và Tên môn là bắt buộc')
            return
        }
        axiosClient.post('/subjects', form)
            .then(() => {
                ToastMessage.success('Thêm môn học thành công')
                setForm({ subjectCode: '', subjectName: '' })
                setShowForm(false)
                load()
            })
            .catch(ToastMessage.error)
    }

    if (loading) return <div className="p-4">Đang tải...</div>

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Môn học</h1>
            <button type="button" onClick={() => setShowForm(!showForm)}
                className="mb-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                {showForm ? 'Đóng form' : 'Thêm môn học'}
            </button>
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded shadow max-w-md space-y-2">
                    <div>
                        <label className="block text-sm font-medium">Mã môn (SubjectId) *</label>
                        <input type="text" value={form.subjectCode} onChange={(e) => setForm({ ...form, subjectCode: e.target.value })}
                            className="w-full border rounded px-3 py-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tên môn *</label>
                        <input type="text" value={form.subjectName} onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
                            className="w-full border rounded px-3 py-2" required />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded">Thêm</button>
                </form>
            )}
            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="text-left p-2">Mã môn</th>
                            <th className="text-left p-2">Tên môn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((s) => (
                            <tr key={s._id} className="border-b">
                                <td className="p-2">{s.subjectCode}</td>
                                <td className="p-2">{s.subjectName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
