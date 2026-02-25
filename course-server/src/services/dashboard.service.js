import User from '../models/user.model.js';
import Class from '../models/class.model.js';
import Enrollment from '../models/enrollment.model.js';
import { Payment } from '../models/payment.model.js';
import { ROLE } from '../constants/Role.js';
import { PAYMENT_STATUS } from '../constants/PaymentStatus.js';

export const getAdminDashboard = async () => {
    const [totalUsers, totalClasses, totalEnrollments, recentPayments] = await Promise.all([
        User.countDocuments(),
        Class.countDocuments(),
        Enrollment.countDocuments(),
        Payment.find({ status: PAYMENT_STATUS.PAID }).sort({ paidDate: -1 }).limit(5).populate('studentId', 'fullName').populate('classId').lean(),
    ]);
    const byRole = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);
    return {
        totalUsers,
        totalClasses,
        totalEnrollments,
        usersByRole: byRole,
        recentPayments,
    };
};

export const getTeacherDashboard = async (userId) => {
    const myClasses = await Class.find({ teacherIds: userId }).populate('courseId').lean();
    const classIds = myClasses.map((c) => c._id);
    const totalStudents = await Enrollment.countDocuments({ classId: { $in: classIds } });
    return {
        totalClasses: myClasses.length,
        totalStudents,
        classes: myClasses,
    };
};

export const getStudentDashboard = async (userId) => {
    const enrollments = await Enrollment.find({ studentId: userId }).populate('classId').lean();
    const unpaidCount = await Payment.countDocuments({
        studentId: userId,
        status: { $in: [PAYMENT_STATUS.UNPAID, PAYMENT_STATUS.OVERDUE] },
    });
    return {
        totalClasses: enrollments.length,
        enrollments,
        unpaidPaymentsCount: unpaidCount,
    };
};

export const getClassDashboard = async () => {
    const classes = await Class.find().populate('courseId').limit(20).lean();
    const withCount = await Promise.all(
        classes.map(async (c) => {
            const count = await Enrollment.countDocuments({ classId: c._id });
            return { ...c, studentCount: count };
        })
    );
    return { classes: withCount };
};

export const getAuditLogs = async (pagination) => {
    // Stub: no audit model in codebase
    return { data: [], total: 0, ...pagination };
};
