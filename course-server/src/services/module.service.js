import Module from '../models/module.model.js';
import Lesson from '../models/lesson.model.js';
import Course from '../models/course.model.js';

export const getModulesByCourse = async (courseId, options = {}) => {
    const course = await Course.findById(courseId).populate('subjectId', 'subjectName').lean();
    if (!course) throw { status: 404, message: 'Course not found' };
    const includeLessons = options.includeLessons !== false;
    const modules = await Module.find({ courseId })
        .sort({ order: 1 })
        .lean();
    if (includeLessons) {
        const lessons = await Lesson.find({ moduleId: { $in: modules.map((m) => m._id) } })
            .sort({ order: 1 })
            .lean();
        const byModule = {};
        lessons.forEach((l) => {
            if (!byModule[l.moduleId]) byModule[l.moduleId] = [];
            byModule[l.moduleId].push(l);
        });
        modules.forEach((m) => {
            m.lessons = byModule[m._id] || [];
        });
    }
    return { course: { _id: course._id, courseName: course.courseName, subjectId: course.subjectId }, modules };
};

export const getModuleById = async (moduleId, courseId) => {
    const module = await Module.findOne({ _id: moduleId, courseId }).lean();
    if (!module) throw { status: 404, message: 'Module not found' };
    return module;
};

export const createModule = async (courseId, body) => {
    const course = await Course.findById(courseId);
    if (!course) throw { status: 404, message: 'Course not found' };
    const maxOrder = await Module.findOne({ courseId }).sort({ order: -1 }).select('order').lean();
    const order = (maxOrder?.order ?? -1) + 1;
    const module = await Module.create({ ...body, courseId, order });
    return module;
};

export const updateModule = async (moduleId, courseId, body) => {
    const allowed = ['title', 'description', 'order'];
    const update = {};
    allowed.forEach((k) => { if (body[k] !== undefined) update[k] = body[k]; });
    const module = await Module.findOneAndUpdate(
        { _id: moduleId, courseId },
        update,
        { new: true }
    );
    if (!module) throw { status: 404, message: 'Module not found' };
    return module;
};

export const deleteModule = async (moduleId, courseId, userId) => {
    const module = await Module.findOne({ _id: moduleId, courseId });
    if (!module) throw { status: 404, message: 'Module not found' };
    await module.softDelete(userId);
    return module;
};
