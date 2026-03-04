import Enrollment from '../models/enrollment.model.js';
import Class from '../models/class.model.js';
import * as lessonProgressService from './lessonProgress.service.js';
import { ENROLL_STATUS } from '../constants/EnrollStatus.js';

export const getMyLearningReport = async (studentId) => {
    const enrollments = await Enrollment.find({ studentId, status: ENROLL_STATUS.ACTIVE })
        .populate({ path: 'classId', populate: { path: 'courseId' } })
        .lean();
    const report = [];
    for (const en of enrollments) {
        const cls = en.classId;
        if (!cls?.courseId) continue;
        const courseId = cls.courseId._id;
        const progress = await lessonProgressService.getProgressByCourse(studentId, courseId);
        report.push({
            classId: cls._id,
            className: cls.className,
            classCode: cls.classCode,
            courseId,
            courseName: cls.courseId.courseName,
            progress: {
                percentCompleted: progress.percentCompleted,
                completedCount: progress.completedCount,
                totalLessons: progress.totalLessons,
            },
        });
    }
    return report;
};

export const getClassLearningReport = async (classId, role, userId) => {
    const cls = await Class.findById(classId).populate('courseId').lean();
    if (!cls) throw { status: 404, message: 'Class not found' };
    if (role === 'teacher' && !cls.teacherIds?.some((id) => id.toString() === userId.toString())) {
        throw { status: 403, message: 'Forbidden' };
    }
    const enrollments = await Enrollment.find({ classId, status: ENROLL_STATUS.ACTIVE })
        .populate('studentId', 'fullName email')
        .lean();
    const courseId = cls.courseId?._id;
    if (!courseId) return { class: cls, students: [] };
    const students = [];
    for (const en of enrollments) {
        const progress = await lessonProgressService.getProgressByCourse(en.studentId._id, courseId);
        students.push({
            studentId: en.studentId._id,
            fullName: en.studentId.fullName,
            email: en.studentId.email,
            progress: {
                percentCompleted: progress.percentCompleted,
                completedCount: progress.completedCount,
                totalLessons: progress.totalLessons,
            },
        });
    }
    students.sort((a, b) => (b.progress.percentCompleted || 0) - (a.progress.percentCompleted || 0));
    return { class: cls, courseName: cls.courseId?.courseName, students };
};
