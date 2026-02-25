import Class from '../models/class.model.js';
import Enrollment from '../models/enrollment.model.js';
import { ExamResult } from '../models/examResult.model.js';
import { Exam } from '../models/exam.model.js';
import { Payment } from '../models/payment.model.js';
import User from '../models/user.model.js';
import { TeacherSnapshot } from '../models/teacherSnapshot.model.js';
import { ROLE } from '../constants/Role.js';
import { PAYMENT_STATUS } from '../constants/PaymentStatus.js';

export const getTeacherStudentCount = async () => {
    const teachers = await User.find({ role: ROLE.TEACHER }).select('_id fullName email').lean();
    const counts = await Promise.all(
        teachers.map(async (t) => {
            const classIds = (await Class.find({ teacherIds: t._id }).select('_id').lean()).map((c) => c._id);
            const total = await Enrollment.countDocuments({ classId: { $in: classIds } });
            return { teacher: t, totalStudents: total };
        })
    );
    return counts;
};

export const getClassPerformance = async (classId) => {
    const examIds = (await Exam.find({ classId }).select('_id').lean()).map((e) => e._id);
    const results = await ExamResult.find({ examId: { $in: examIds } })
        .populate('examId')
        .populate('studentId', 'fullName email')
        .lean();
    const byExam = {};
    results.forEach((r) => {
        const eid = r.examId?._id?.toString();
        if (!byExam[eid]) byExam[eid] = [];
        byExam[eid].push(r);
    });
    return { classId, byExam, results };
};

export const getStudentProgress = async (studentId) => {
    const results = await ExamResult.find({ studentId })
        .populate({ path: 'examId', populate: 'classId' })
        .sort({ createdAt: 1 })
        .lean();
    const payments = await Payment.find({ studentId }).populate('classId').lean();
    return { results, payments };
};

export const getFinancialReport = async () => {
    const paidPipeline = [
        { $match: { status: PAYMENT_STATUS.PAID } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ];
    const unpaidStatuses = [PAYMENT_STATUS.UNPAID, PAYMENT_STATUS.OVERDUE];
    const unpaidPipeline = [
        { $match: { status: { $in: unpaidStatuses } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ];
    const paid = await Payment.aggregate(paidPipeline);
    const unpaid = await Payment.aggregate(unpaidPipeline);
    return {
        totalPaid: paid[0]?.total ?? 0,
        paidCount: paid[0]?.count ?? 0,
        totalUnpaid: unpaid[0]?.total ?? 0,
        unpaidCount: unpaid[0]?.count ?? 0,
    };
};

export const getClassScoreChart = async (classId) => {
    const examIds = (await Exam.find({ classId }).select('_id title').lean()).map((e) => e._id);
    const agg = await ExamResult.aggregate([
        { $match: { examId: { $in: examIds } } },
        { $group: { _id: '$examId', avg: { $avg: '$averageScore' }, count: { $sum: 1 } } },
        { $lookup: { from: 'exams', localField: '_id', foreignField: '_id', as: 'exam' } },
        { $unwind: '$exam' },
        { $project: { examTitle: '$exam.title', averageScore: { $round: ['$avg', 2] }, count: 1 } },
    ]);
    return agg;
};

export const getTeacherMonthly = async (month) => {
    const snapshots = await TeacherSnapshot.find({ month })
        .populate('teacherId', 'fullName email')
        .lean();
    return snapshots;
};
