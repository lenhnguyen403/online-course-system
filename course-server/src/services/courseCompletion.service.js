import CourseCompletion from '../models/courseCompletion.model.js';
import Course from '../models/course.model.js';
import User from '../models/user.model.js';
import * as lessonProgressService from './lessonProgress.service.js';
import { canAccessCourse } from './contentAccess.service.js';

export const getMyCompletions = async (studentId) => {
    const list = await CourseCompletion.find({ studentId })
        .populate('courseId', 'courseName')
        .populate('classId', 'className classCode')
        .sort({ completedAt: -1 })
        .lean();
    return list;
};

export const getOrIssueCertificate = async (studentId, courseId) => {
    const allowed = await canAccessCourse(studentId, 'student', courseId);
    if (!allowed) throw { status: 403, message: 'Forbidden' };
    const progress = await lessonProgressService.getProgressByCourse(studentId, courseId);
    if (progress.percentCompleted < 100) throw { status: 400, message: 'Chưa hoàn thành 100% khóa học' };
    let completion = await CourseCompletion.findOne({ studentId, courseId })
        .populate('courseId', 'courseName')
        .populate('classId', 'className')
        .lean();
    if (!completion) {
        const newCompletion = await CourseCompletion.create({ studentId, courseId });
        completion = await CourseCompletion.findById(newCompletion._id)
            .populate('courseId', 'courseName')
            .populate('classId', 'className')
            .lean();
    }
    const student = await User.findById(studentId).select('fullName').lean();
    return { ...completion, studentName: student?.fullName };
};
