import Lesson from '../models/lesson.model.js';
import Module from '../models/module.model.js';
import Course from '../models/course.model.js';

export const getLessonsByModule = async (moduleId, courseId) => {
    const module = await Module.findOne({ _id: moduleId, courseId });
    if (!module) throw { status: 404, message: 'Module not found' };
    const lessons = await Lesson.find({ moduleId }).sort({ order: 1 }).lean();
    return lessons;
};

export const getLessonById = async (lessonId, courseId) => {
    const lesson = await Lesson.findById(lessonId).lean();
    if (!lesson) throw { status: 404, message: 'Lesson not found' };
    const module = await Module.findOne({ _id: lesson.moduleId, courseId });
    if (!module) throw { status: 404, message: 'Lesson not in this course' };
    return lesson;
};

export const getLessonByIdForPlayer = async (lessonId) => {
    const lesson = await Lesson.findById(lessonId).populate('moduleId', 'courseId title order').lean();
    if (!lesson) throw { status: 404, message: 'Lesson not found' };
    return lesson;
};

export const createLesson = async (moduleId, courseId, body) => {
    const module = await Module.findOne({ _id: moduleId, courseId });
    if (!module) throw { status: 404, message: 'Module not found' };
    const maxOrder = await Lesson.findOne({ moduleId }).sort({ order: -1 }).select('order').lean();
    const order = (maxOrder?.order ?? -1) + 1;
    const lesson = await Lesson.create({ ...body, moduleId, order });
    return lesson;
};

export const updateLesson = async (lessonId, courseId, body) => {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) throw { status: 404, message: 'Lesson not found' };
    const module = await Module.findOne({ _id: lesson.moduleId, courseId });
    if (!module) throw { status: 404, message: 'Lesson not in this course' };
    const allowed = ['title', 'lessonType', 'content', 'resourceUrl', 'durationMinutes', 'isFree', 'order'];
    const update = {};
    allowed.forEach((k) => { if (body[k] !== undefined) update[k] = body[k]; });
    const updated = await Lesson.findByIdAndUpdate(lessonId, update, { new: true });
    return updated;
};

export const deleteLesson = async (lessonId, courseId, userId) => {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) throw { status: 404, message: 'Lesson not found' };
    const module = await Module.findOne({ _id: lesson.moduleId, courseId });
    if (!module) throw { status: 404, message: 'Lesson not in this course' };
    await lesson.softDelete(userId);
    return lesson;
};
