import { useState, useEffect } from 'react'
import { axiosClient } from '../../utils/axiosClient'
import ToastMessage from '../../messages/ToastMessage'

export default function TeacherProfile() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosClient.get('/me')
            .then((res) => setUser(res.data))
            .catch(ToastMessage.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading || !user) return <div className="p-4">Đang tải...</div>

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Thông tin cá nhân</h1>
            <div className="bg-white rounded shadow p-6 max-w-md">
                <dl className="grid gap-3 text-sm">
                    <div><dt className="text-gray-500">Họ tên</dt><dd>{user.fullName}</dd></div>
                    <div><dt className="text-gray-500">Email</dt><dd>{user.email}</dd></div>
                    <div><dt className="text-gray-500">Số điện thoại</dt><dd>{user.phoneNumber || '-'}</dd></div>
                    <div><dt className="text-gray-500">Ngày sinh</dt><dd>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('vi-VN') : '-'}</dd></div>
                    <div><dt className="text-gray-500">Địa chỉ</dt><dd>{user.address || '-'}</dd></div>
                </dl>
            </div>
        </div>
    )
}
