const adminMenu = [
    { id: 1, name: 'Dashboard', subMenu: [], },
    {
        id: 2, name: 'Người dùng', subMenu: [
            { subId: '1', subName: 'Giảng viên', link: '' },
            { subId: '2', subName: 'Học viên', link: '' },
            { subId: '3', subName: 'Quyền người dùng', link: '' },
        ], link: '/menu'
    },
    {
        id: 3, name: 'Lớp học', subMenu: [
            { subId: '1', subName: 'Môn học', link: '' },
            { subId: '2', subName: 'Điểm danh', link: '' },
        ],
    },
    {
        id: 4, name: 'Nhật ký', subMenu: [
            { subId: '1', subName: 'Nhật ký giảng viên', link: '' },
            { subId: '2', subName: 'Nhật ký học viên', link: '' },
        ],
    },
    {
        id: 5, name: 'Kiểm tra', subMenu: [
            { subId: '1', subName: 'Thông tin', link: '' },
            { subId: '2', subName: 'Kết quả', link: '' },
        ],
    },
    {
        id: 6, name: 'Đánh giá', subMenu: [
            { subId: '1', subName: 'Đánh giá của giảng viên', link: '' },
            { subId: '2', subName: 'Đánh giá của học viên', link: '' },
        ],
    },
    {
        id: 7, name: 'Báo cáo phân tích', subMenu: [

        ],
    },
    {
        id: 8, name: 'Cài đặt hệ thống', subMenu: [

        ],
    },
]

export { adminMenu }