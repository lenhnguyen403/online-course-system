import User from '../models/user.model.js';
import Enrollment from '../models/enrollment.model.js';
import Class from '../models/class.model.js';
import Course from '../models/course.model.js';
import { Payment } from '../models/payment.model.js';
import { ExamResult } from '../models/examResult.model.js';
import { Journal } from '../models/journal.model.js';
import { ROLE } from '../constants/Role.js';
import { ENROLL_STATUS } from '../constants/EnrollStatus.js';

export const getProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) throw { status: 404, message: 'User not found' };
    return user;
};

export const updateProfile = async (userId, body) => {
    const allowed = ['fullName', 'phoneNumber', 'dateOfBirth', 'address', 'identityNumber'];
    const update = {};
    allowed.forEach((k) => { if (body[k] !== undefined) update[k] = body[k]; });
    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password');
    if (!user) throw { status: 404, message: 'User not found' };
    return user;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
    const { passwordCompare } = await import('../middlewares/hash_password.middleware.js');
    const { passwordEncoded } = await import('../middlewares/hash_password.middleware.js');
    const user = await User.findById(userId);
    if (!user) throw { status: 404, message: 'User not found' };
    const valid = passwordCompare(currentPassword, user.password);
    if (!valid) throw { status: 400, message: 'Current password is incorrect' };
    user.password = await passwordEncoded(newPassword);
    await user.save();
    return { message: 'Password changed successfully' };
};

export const getMyClasses = async (userId, role, pagination) => {
    if (role === ROLE.STUDENT) {
        const enrollments = await Enrollment.find({ studentId: userId, status: ENROLL_STATUS.ACTIVE })
            .populate({ path: 'classId', populate: { path: 'courseId', populate: 'subjectId' } })
            .skip(pagination.offset)
            .limit(pagination.limit)
            .lean();
        const total = await Enrollment.countDocuments({ studentId: userId, status: ENROLL_STATUS.ACTIVE });
        return { data: enrollments.map((e) => e.classId).filter(Boolean), total, ...pagination };
    }
    if (role === ROLE.TEACHER) {
        const classes = await Class.find({ teacherIds: userId })
            .populate({ path: 'courseId', populate: 'subjectId' })
            .skip(pagination.offset)
            .limit(pagination.limit)
            .lean();
        const total = await Class.countDocuments({ teacherIds: userId });
        return { data: classes, total, ...pagination };
    }
    return { data: [], total: 0, ...pagination };
};

export const getMyPayments = async (userId, pagination) => {
    const payments = await Payment.find({ studentId: userId })
        .populate('classId')
        .skip(pagination.offset)
        .limit(pagination.limit)
        .sort({ dueDate: -1 })
        .lean();
    const total = await Payment.countDocuments({ studentId: userId });
    return { data: payments, total, ...pagination };
};

export const getMyResults = async (userId, pagination) => {
    const results = await ExamResult.find({ studentId: userId })
        .populate({ path: 'examId', populate: 'classId' })
        .skip(pagination.offset)
        .limit(pagination.limit)
        .sort({ createdAt: -1 })
        .lean();
    const total = await ExamResult.countDocuments({ studentId: userId });
    return { data: results, total, ...pagination };
};

export const getMyJournals = async (userId, role, pagination) => {
    const filter = role === ROLE.TEACHER ? { teacherId: userId } : { studentId: userId };
    const journals = await Journal.find(filter)
        .populate('classId')
        .populate('studentId', 'fullName email')
        .skip(pagination.offset)
        .limit(pagination.limit)
        .sort({ createdAt: -1 })
        .lean();
    const total = await Journal.countDocuments(filter);
    return { data: journals, total, ...pagination };
};
