import Class from '../models/class.model.js';
import Course from '../models/course.model.js';
import Enrollment from '../models/enrollment.model.js';
import User from '../models/user.model.js';
import { ROLE } from '../constants/Role.js';
import { ENROLL_STATUS } from '../constants/EnrollStatus.js';

export const getClasses = async (pagination, filter = {}) => {
    const [data, total] = await Promise.all([
        Class.find(filter)
            .populate('courseId')
            .skip(pagination.offset)
            .limit(pagination.limit)
            .sort({ createdAt: -1 })
            .lean(),
        Class.countDocuments(filter),
    ]);
    return { data, total, ...pagination };
};

export const createClass = async (body) => {
    const course = await Course.findById(body.courseId);
    if (!course) throw { status: 400, message: 'Course not found' };
    const cls = await Class.create(body);
    await cls.populate('courseId');
    return cls;
};

export const getClassById = async (id) => {
    const cls = await Class.findById(id).populate('courseId').populate('teacherIds', 'fullName email');
    if (!cls) throw { status: 404, message: 'Class not found' };
    return cls;
};

export const updateClass = async (id, body) => {
    const allowed = ['classCode', 'className', 'courseId', 'startDate', 'endDate', 'status'];
    const update = {};
    allowed.forEach((k) => { if (body[k] !== undefined) update[k] = body[k]; });
    const cls = await Class.findByIdAndUpdate(id, update, { new: true }).populate('courseId');
    if (!cls) throw { status: 404, message: 'Class not found' };
    return cls;
};

export const deactivateClass = async (id, userId) => {
    const cls = await Class.findById(id);
    if (!cls) throw { status: 404, message: 'Class not found' };
    await cls.softDelete(userId);
    return cls;
};

// Students
export const getClassStudents = async (classId, pagination, status) => {
    const filter = { classId };
    if (status) filter.status = status;
    const [data, total] = await Promise.all([
        Enrollment.find(filter)
            .populate('studentId', 'fullName email phoneNumber')
            .skip(pagination.offset)
            .limit(pagination.limit)
            .lean(),
        Enrollment.countDocuments(filter),
    ]);
    return { data, total, ...pagination };
};

export const addStudentToClass = async (classId, studentId) => {
    const cls = await Class.findById(classId);
    if (!cls) throw { status: 404, message: 'Class not found' };
    const user = await User.findById(studentId);
    if (!user || user.role !== ROLE.STUDENT) throw { status: 400, message: 'Invalid student' };
    const exists = await Enrollment.findOne({ classId, studentId });
    if (exists) throw { status: 400, message: 'Student already in class' };
    const enrollment = await Enrollment.create({ classId, studentId });
    await enrollment.populate('studentId', 'fullName email');
    return enrollment;
};

export const getClassStudentById = async (classId, studentId) => {
    const enrollment = await Enrollment.findOne({ classId, studentId }).populate('studentId');
    if (!enrollment) throw { status: 404, message: 'Enrollment not found' };
    return enrollment;
};

export const updateClassStudent = async (classId, studentId, body) => {
    const enrollment = await Enrollment.findOneAndUpdate(
        { classId, studentId },
        { $set: body },
        { new: true }
    ).populate('studentId');
    if (!enrollment) throw { status: 404, message: 'Enrollment not found' };
    return enrollment;
};

export const updateClassStudentStatus = async (classId, studentId, status) => {
    const enrollment = await Enrollment.findOneAndUpdate(
        { classId, studentId },
        { status },
        { new: true }
    ).populate('studentId');
    if (!enrollment) throw { status: 404, message: 'Enrollment not found' };
    return enrollment;
};

export const removeStudentFromClass = async (classId, studentId) => {
    const result = await Enrollment.deleteOne({ classId, studentId });
    if (result.deletedCount === 0) throw { status: 404, message: 'Enrollment not found' };
    return { message: 'Student removed from class' };
};

// Teachers
export const getClassTeachers = async (classId) => {
    const cls = await Class.findById(classId).populate('teacherIds', 'fullName email');
    if (!cls) throw { status: 404, message: 'Class not found' };
    return cls.teacherIds || [];
};

export const addTeacherToClass = async (classId, teacherId) => {
    const cls = await Class.findById(classId);
    if (!cls) throw { status: 404, message: 'Class not found' };
    const user = await User.findById(teacherId);
    if (!user || user.role !== ROLE.TEACHER) throw { status: 400, message: 'Invalid teacher' };
    if (cls.teacherIds.some((t) => t.toString() === teacherId))
        throw { status: 400, message: 'Teacher already in class' };
    cls.teacherIds.push(teacherId);
    await cls.save();
    await cls.populate('teacherIds', 'fullName email');
    return cls.teacherIds;
};

export const removeTeacherFromClass = async (classId, teacherId) => {
    const cls = await Class.findById(classId);
    if (!cls) throw { status: 404, message: 'Class not found' };
    cls.teacherIds = cls.teacherIds.filter((t) => t.toString() !== teacherId);
    await cls.save();
    return { message: 'Teacher removed from class' };
};
