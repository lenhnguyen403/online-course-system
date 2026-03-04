import Course from '../models/course.model.js';
import Subject from '../models/subject.model.js';

export const getCourses = async (pagination, filter = {}) => {
    const [data, total] = await Promise.all([
        Course.find(filter)
            .populate('subjectId')
            .skip(pagination.offset)
            .limit(pagination.limit)
            .sort({ createdAt: -1 })
            .lean(),
        Course.countDocuments(filter),
    ]);
    return { data, total, ...pagination };
};

export const createCourse = async (body) => {
    const subject = await Subject.findById(body.subjectId);
    if (!subject) throw { status: 400, message: 'Subject not found' };
    const course = await Course.create(body);
    await course.populate('subjectId');
    return course;
};

export const getCourseById = async (id) => {
    const course = await Course.findById(id).populate('subjectId');
    if (!course) throw { status: 404, message: 'Course not found' };
    return course;
};

export const updateCourse = async (id, body) => {
    const allowed = ['courseCode', 'courseName', 'subjectId', 'durationInMonths', 'tuitionFee'];
    const update = {};
    allowed.forEach((k) => { if (body[k] !== undefined) update[k] = body[k]; });
    const course = await Course.findByIdAndUpdate(id, update, { new: true }).populate('subjectId');
    if (!course) throw { status: 404, message: 'Course not found' };
    return course;
};

export const deactivateCourse = async (id, userId) => {
    const course = await Course.findById(id);
    if (!course) throw { status: 404, message: 'Course not found' };
    await course.softDelete(userId);
    return course;
};
