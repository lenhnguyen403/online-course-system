import * as lessonProgressService from '../../services/lessonProgress.service.js';
import Lesson from '../../models/lesson.model.js';
import { canAccessCourse } from '../../services/contentAccess.service.js';

export const getMyProgressByCourse = async (req, res) => {
    if (req.user?.role !== 'student') return res.status(403).json({ message: 'Only students have lesson progress' });
    const allowed = await canAccessCourse(req.user.id, req.user.role, req.params.courseId);
    if (!allowed) return res.status(403).json({ message: 'Forbidden' });
    const data = await lessonProgressService.getProgressByCourse(req.user.id, req.params.courseId);
    return res.status(200).json(data);
};

export const getMyLessonProgress = async (req, res) => {
    if (req.user?.role !== 'student') return res.status(403).json({ message: 'Only students have lesson progress' });
    const data = await lessonProgressService.getLessonProgress(req.user.id, req.params.lessonId);
    return res.status(200).json(data);
};

export const updateMyLessonProgress = async (req, res) => {
    if (req.user?.role !== 'student') return res.status(403).json({ message: 'Only students can update progress' });
    const lesson = await Lesson.findById(req.params.lessonId).populate('moduleId', 'courseId');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    const courseId = lesson.moduleId?.courseId;
    if (!courseId) return res.status(400).json({ message: 'Invalid lesson' });
    const allowed = await canAccessCourse(req.user.id, req.user.role, courseId);
    if (!allowed) return res.status(403).json({ message: 'Forbidden' });
    const progress = await lessonProgressService.upsertProgress(
        req.user.id,
        req.params.lessonId,
        req.body
    );
    return res.status(200).json(progress);
};

export const markLessonCompleted = async (req, res) => {
    if (req.user?.role !== 'student') return res.status(403).json({ message: 'Only students can mark completed' });
    const lesson = await Lesson.findById(req.params.lessonId).populate('moduleId', 'courseId');
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    const courseId = lesson.moduleId?.courseId;
    if (!courseId) return res.status(400).json({ message: 'Invalid lesson' });
    const allowed = await canAccessCourse(req.user.id, req.user.role, courseId);
    if (!allowed) return res.status(403).json({ message: 'Forbidden' });
    const progress = await lessonProgressService.markLessonCompleted(req.user.id, req.params.lessonId);
    return res.status(200).json(progress);
};
