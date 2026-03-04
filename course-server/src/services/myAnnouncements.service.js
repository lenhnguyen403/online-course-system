import Enrollment from '../models/enrollment.model.js';
import Announcement from '../models/announcement.model.js';
import { ENROLL_STATUS } from '../constants/EnrollStatus.js';

export const getMyAnnouncements = async (studentId, pagination) => {
    const enrollments = await Enrollment.find({ studentId, status: ENROLL_STATUS.ACTIVE })
        .select('classId')
        .lean();
    const classIds = enrollments.map((e) => e.classId).filter(Boolean);
    if (classIds.length === 0) return { data: [], total: 0, ...pagination };

    const [data, total] = await Promise.all([
        Announcement.find({ classId: { $in: classIds } })
            .populate('classId', 'className classCode')
            .populate('authorId', 'fullName')
            .sort({ pinned: -1, createdAt: -1 })
            .skip(pagination.offset)
            .limit(pagination.limit)
            .lean(),
        Announcement.countDocuments({ classId: { $in: classIds } }),
    ]);
    return { data, total, ...pagination };
};
