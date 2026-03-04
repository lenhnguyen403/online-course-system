import Announcement from '../models/announcement.model.js';
import Class from '../models/class.model.js';
import Enrollment from '../models/enrollment.model.js';
import { ENROLL_STATUS } from '../constants/EnrollStatus.js';
import * as notificationService from './notification.service.js';

export const getAnnouncementsByClass = async (classId, limit = 50) => {
    await Class.findById(classId).orFail(() => { throw { status: 404, message: 'Class not found' }; });
    const list = await Announcement.find({ classId })
        .populate('authorId', 'fullName')
        .sort({ pinned: -1, createdAt: -1 })
        .limit(limit)
        .lean();
    return list;
};

export const getAnnouncementById = async (announcementId, classId) => {
    const announcement = await Announcement.findOne({ _id: announcementId, classId })
        .populate('authorId', 'fullName')
        .lean();
    if (!announcement) throw { status: 404, message: 'Announcement not found' };
    return announcement;
};

export const createAnnouncement = async (classId, body, authorId) => {
    await Class.findById(classId).orFail(() => { throw { status: 404, message: 'Class not found' }; });
    const announcement = await Announcement.create({ ...body, classId, authorId });
    await announcement.populate('authorId', 'fullName');
    const enrollments = await Enrollment.find({ classId, status: ENROLL_STATUS.ACTIVE }).select('studentId').lean();
    const studentIds = enrollments.map((e) => e.studentId).filter(Boolean);
    if (studentIds.length) {
        await notificationService.createForUsers(studentIds, {
            title: body.title || 'Thông báo mới',
            body: body.content || '',
            type: 'announcement',
            link: `/student/announcements`,
        });
    }
    return announcement;
};

export const updateAnnouncement = async (announcementId, classId, body) => {
    const allowed = ['title', 'content', 'pinned'];
    const update = {};
    allowed.forEach((k) => { if (body[k] !== undefined) update[k] = body[k]; });
    const announcement = await Announcement.findOneAndUpdate(
        { _id: announcementId, classId },
        update,
        { new: true }
    ).populate('authorId', 'fullName');
    if (!announcement) throw { status: 404, message: 'Announcement not found' };
    return announcement;
};

export const deleteAnnouncement = async (announcementId, classId, userId) => {
    const announcement = await Announcement.findOne({ _id: announcementId, classId });
    if (!announcement) throw { status: 404, message: 'Announcement not found' };
    await announcement.softDelete(userId);
    return announcement;
};
