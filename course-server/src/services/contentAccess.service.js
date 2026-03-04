import Class from '../models/class.model.js';
import Enrollment from '../models/enrollment.model.js';
import { ENROLL_STATUS } from '../constants/EnrollStatus.js';

/**
 * Check if user can access course content (read). Admin/staff: all; teacher: has class with this course; student: enrolled in class with this course.
 */
export const canAccessCourse = async (userId, role, courseId) => {
    if (role === 'admin' || role === 'staff') return true;
    if (role === 'teacher') {
        const cls = await Class.findOne({ courseId, teacherIds: userId }).lean();
        return !!cls;
    }
    if (role === 'student') {
        const enrollments = await Enrollment.find({ studentId: userId, status: ENROLL_STATUS.ACTIVE })
            .populate('classId', 'courseId')
            .lean();
        return enrollments.some((e) => e.classId?.courseId?.toString() === courseId.toString());
    }
    return false;
};

/**
 * Check if user can manage (create/update/delete) course content. Admin/staff: all; teacher: has class with this course.
 */
export const canManageCourseContent = async (userId, role, courseId) => {
    if (role === 'admin' || role === 'staff') return true;
    if (role === 'teacher') {
        const cls = await Class.findOne({ courseId, teacherIds: userId }).lean();
        return !!cls;
    }
    return false;
};
