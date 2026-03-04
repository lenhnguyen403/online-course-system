import LessonProgress from '../models/lessonProgress.model.js';
import Lesson from '../models/lesson.model.js';
import Module from '../models/module.model.js';
import CourseCompletion from '../models/courseCompletion.model.js';
import { PROGRESS_STATUS } from '../constants/ProgressStatus.js';

export const getProgressByCourse = async (studentId, courseId) => {
    const modules = await Module.find({ courseId }).sort({ order: 1 }).lean();
    const moduleIds = modules.map((m) => m._id);
    const lessons = await Lesson.find({ moduleId: { $in: moduleIds } }).sort({ order: 1 }).lean();
    const lessonIds = lessons.map((l) => l._id);
    const progressList = await LessonProgress.find({
        studentId,
        lessonId: { $in: lessonIds },
    }).lean();
    const progressByLesson = {};
    progressList.forEach((p) => { progressByLesson[p.lessonId.toString()] = p; });
    let completedCount = 0;
    const lessonProgress = lessons.map((l) => {
        const p = progressByLesson[l._id.toString()];
        const status = p?.status || PROGRESS_STATUS.NOT_STARTED;
        if (status === PROGRESS_STATUS.COMPLETED) completedCount++;
        return {
            lessonId: l._id,
            moduleId: l.moduleId,
            title: l.title,
            order: l.order,
            status,
            completedAt: p?.completedAt ?? null,
            lastAccessedAt: p?.lastAccessedAt ?? null,
        };
    });
    const total = lessons.length;
    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    return {
        courseId,
        totalLessons: total,
        completedCount,
        percentCompleted: percent,
        lessonProgress,
        modules: modules.map((m) => ({ _id: m._id, title: m.title, order: m.order })),
    };
};

export const getLessonProgress = async (studentId, lessonId) => {
    const progress = await LessonProgress.findOne({ studentId, lessonId }).lean();
    return progress || { status: PROGRESS_STATUS.NOT_STARTED, completedAt: null, lastAccessedAt: null };
};

export const upsertProgress = async (studentId, lessonId, body) => {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) throw { status: 404, message: 'Lesson not found' };
    const status = body.status || PROGRESS_STATUS.IN_PROGRESS;
    const completedAt = status === PROGRESS_STATUS.COMPLETED ? new Date() : null;
    let progress = await LessonProgress.findOne({ studentId, lessonId });
    if (!progress) {
        progress = await LessonProgress.create({
            studentId,
            lessonId,
            status,
            completedAt,
            lastAccessedAt: new Date(),
        });
    } else {
        progress.status = status;
        if (status === PROGRESS_STATUS.COMPLETED) progress.completedAt = completedAt || progress.completedAt;
        progress.lastAccessedAt = new Date();
        await progress.save();
    }
    return progress;
};

export const markLessonCompleted = async (studentId, lessonId) => {
    const progress = await upsertProgress(studentId, lessonId, { status: PROGRESS_STATUS.COMPLETED });
    const lesson = await Lesson.findById(lessonId).populate('moduleId', 'courseId').lean();
    const courseId = lesson?.moduleId?.courseId;
    if (courseId) {
        const stats = await getProgressByCourse(studentId, courseId);
        if (stats.percentCompleted >= 100) {
            await CourseCompletion.findOneAndUpdate(
                { studentId, courseId },
                { studentId, courseId, completedAt: new Date() },
                { upsert: true }
            );
        }
    }
    return progress;
};
