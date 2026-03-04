import User from '../models/user.model.js';
import Class from '../models/class.model.js';
import Enrollment from '../models/enrollment.model.js';
import Assignment from '../models/assignment.model.js';
import Submission from '../models/submission.model.js';
import Announcement from '../models/announcement.model.js';
import { Payment } from '../models/payment.model.js';
import { ROLE } from '../constants/Role.js';
import { PAYMENT_STATUS } from '../constants/PaymentStatus.js';
import { ENROLL_STATUS } from '../constants/EnrollStatus.js';
import { getClassAverageScore } from './exam.service.js';

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
    // Feature 17: Thống kê số lượng HV của từng GV
    const teachers = await User.find({ role: ROLE.TEACHER }).select('_id fullName').lean();
    const teacherStats = await Promise.all(
        teachers.map(async (t) => {
            const classes = await Class.find({ teacherIds: t._id }).select('_id').lean();
            const classIds = classes.map((c) => c._id);
            const totalStudents = await Enrollment.countDocuments({ classId: { $in: classIds } });
            return { teacherId: t._id, teacherName: t.fullName, totalStudents, totalClasses: classes.length };
        })
    );
    return {
        totalUsers,
        totalClasses,
        totalEnrollments,
        usersByRole: byRole,
        recentPayments,
        teacherStats,
    };
};

export const getTeacherDashboard = async (userId) => {
    const myClasses = await Class.find({ teacherIds: userId }).populate('courseId').lean();
    const classIds = myClasses.map((c) => c._id);
    const totalStudents = await Enrollment.countDocuments({ classId: { $in: classIds } });
    const assignmentIds = (await Assignment.find({ classId: { $in: classIds } }).select('_id').lean()).map((a) => a._id);
    const pendingSubmissionsCount = assignmentIds.length
        ? await Submission.countDocuments({ assignmentId: { $in: assignmentIds }, score: null })
        : 0;
    return {
        totalClasses: myClasses.length,
        totalStudents,
        classes: myClasses,
        pendingSubmissionsCount,
    };
};

export const getTeacherPendingSubmissions = async (userId, limit = 50) => {
    const myClasses = await Class.find({ teacherIds: userId }).select('_id className').lean();
    const classIds = myClasses.map((c) => c._id);
    const assignments = await Assignment.find({ classId: { $in: classIds } })
        .select('_id title classId')
        .populate('classId', 'className classCode')
        .lean();
    const assignmentIds = assignments.map((a) => a._id);
    if (!assignmentIds.length) return { data: [], total: 0 };
    const submissions = await Submission.find({ assignmentId: { $in: assignmentIds }, score: null })
        .populate('assignmentId')
        .populate('studentId', 'fullName email')
        .sort({ submittedAt: 1 })
        .limit(limit)
        .lean();
    const byAssignment = Object.fromEntries(assignments.map((a) => [a._id.toString(), a]));
    const data = submissions.map((s) => {
        const ass = byAssignment[s.assignmentId?._id?.toString()] || s.assignmentId;
        return {
            _id: s._id,
            submissionId: s._id,
            assignmentId: s.assignmentId?._id,
            assignmentTitle: ass?.title || s.assignmentId?.title,
            classId: ass?.classId?._id || ass?.classId,
            className: ass?.classId?.className,
            classCode: ass?.classId?.classCode,
            studentId: s.studentId?._id,
            studentName: s.studentId?.fullName,
            studentEmail: s.studentId?.email,
            submittedAt: s.submittedAt,
        };
    });
    const total = await Submission.countDocuments({ assignmentId: { $in: assignmentIds }, score: null });
    return { data, total };
};

export const getStudentDashboard = async (userId) => {
    const enrollments = await Enrollment.find({ studentId: userId, status: ENROLL_STATUS.ACTIVE }).populate('classId').lean();
    const classIds = enrollments.map((e) => e.classId?._id).filter(Boolean);
    const unpaidCount = await Payment.countDocuments({
        studentId: userId,
        status: { $in: [PAYMENT_STATUS.UNPAID, PAYMENT_STATUS.OVERDUE] },
    });
    const now = new Date();
    const upcomingAssignments = classIds.length
        ? await Assignment.find({ classId: { $in: classIds }, dueDate: { $gte: now } })
            .populate('classId', 'className classCode')
            .sort({ dueDate: 1 })
            .limit(5)
            .lean()
        : [];
    const recentAnnouncements = classIds.length
        ? await Announcement.find({ classId: { $in: classIds } })
            .populate('classId', 'className')
            .populate('authorId', 'fullName')
            .sort({ pinned: -1, createdAt: -1 })
            .limit(5)
            .lean()
        : [];
    return {
        totalClasses: enrollments.length,
        enrollments,
        unpaidPaymentsCount: unpaidCount,
        upcomingAssignments,
        recentAnnouncements,
    };
};

export const getClassDashboard = async () => {
    const classes = await Class.find().populate('courseId').limit(20).lean();
    const withCount = await Promise.all(
        classes.map(async (c) => {
            const count = await Enrollment.countDocuments({ classId: c._id });
            const { averageScore } = await getClassAverageScore(c._id.toString());
            return { ...c, studentCount: count, averageScore: averageScore ?? 0 };
        })
    );
    return { classes: withCount };
};

export const getAuditLogs = async (pagination) => {
    // Stub: no audit model in codebase
    return { data: [], total: 0, ...pagination };
};

// Feature 19: Biểu đồ điểm trung bình từng HV trong lớp
export const getClassScoreChart = async (classId) => {
    const { Exam } = await import('../models/exam.model.js');
    const { ExamResult } = await import('../models/examResult.model.js');
    const exams = await Exam.find({ classId }).select('_id').lean();
    const examIds = exams.map((e) => e._id);
    const results = await ExamResult.aggregate([
        { $match: { examId: { $in: examIds } } },
        { $group: { _id: '$studentId', avgScore: { $avg: '$averageScore' } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
        { $project: { studentId: '$_id', fullName: '$user.fullName', averageScore: { $round: ['$avgScore', 2] } } },
    ]);
    return { data: results };
};

// Feature 20: Lưu snapshot thông tin GV hàng tháng
export const generateTeacherSnapshot = async () => {
    const { TeacherSnapshot } = await import('../models/teacherSnapshot.model.js');
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const teachers = await User.find({ role: ROLE.TEACHER }).select('_id fullName').lean();
    const snapshots = await Promise.all(
        teachers.map(async (t) => {
            const classes = await Class.find({ teacherIds: t._id }).select('_id').lean();
            const classIds = classes.map((c) => c._id);
            const totalStudents = await Enrollment.countDocuments({ classId: { $in: classIds } });
            return TeacherSnapshot.findOneAndUpdate(
                { teacherId: t._id, month },
                { teacherId: t._id, month, totalClasses: classes.length, totalStudents, generatedAt: now },
                { upsert: true, new: true }
            ).then((doc) => doc.toObject());
        })
    );
    return { message: 'Teacher snapshot generated', month, count: snapshots.length };
};
