import Message from '../models/message.model.js';
import Class from '../models/class.model.js';
import Enrollment from '../models/enrollment.model.js';
import { ENROLL_STATUS } from '../constants/EnrollStatus.js';

const canAccessClass = async (userId, role, classId) => {
    const cls = await Class.findById(classId).lean();
    if (!cls) return false;
    if (role === 'admin' || role === 'staff') return true;
    if (role === 'teacher' && cls.teacherIds?.some((id) => id.toString() === userId.toString())) return true;
    if (role === 'student') {
        const en = await Enrollment.findOne({ classId, studentId: userId, status: ENROLL_STATUS.ACTIVE });
        return !!en;
    }
    return false;
};

export const getMessagesByClass = async (classId, userId, role, pagination) => {
    const allowed = await canAccessClass(userId, role, classId);
    if (!allowed) throw { status: 403, message: 'Forbidden' };
    const [data, total] = await Promise.all([
        Message.find({ classId })
            .populate('senderId', 'fullName email')
            .sort({ createdAt: -1 })
            .skip(pagination.offset)
            .limit(pagination.limit)
            .lean(),
        Message.countDocuments({ classId }),
    ]);
    return { data: data.reverse(), total, ...pagination };
};

export const createMessage = async (classId, senderId, role, content) => {
    const allowed = await canAccessClass(senderId, role, classId);
    if (!allowed) throw { status: 403, message: 'Forbidden' };
    if (!content?.trim()) throw { status: 400, message: 'Content is required' };
    const message = await Message.create({ classId, senderId, content: content.trim() });
    await message.populate('senderId', 'fullName email');
    return message;
};
