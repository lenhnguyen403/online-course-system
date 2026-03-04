import * as moduleService from '../../services/module.service.js';
import * as lessonService from '../../services/lesson.service.js';
import { canAccessCourse } from '../../services/contentAccess.service.js';

export const getModulesByCourse = async (req, res) => {
    const allowed = await canAccessCourse(req.user?.id, req.user?.role, req.params.courseId);
    if (!allowed) return res.status(403).json({ message: 'Forbidden' });
    const data = await moduleService.getModulesByCourse(req.params.courseId, { includeLessons: true });
    return res.status(200).json(data);
};

export const getModuleById = async (req, res) => {
    const allowed = await canAccessCourse(req.user?.id, req.user?.role, req.params.courseId);
    if (!allowed) return res.status(403).json({ message: 'Forbidden' });
    const data = await moduleService.getModuleById(req.params.moduleId, req.params.courseId);
    return res.status(200).json(data);
};

export const createModule = async (req, res) => {
    const module = await moduleService.createModule(req.params.courseId, req.body);
    return res.status(201).json(module);
};

export const updateModule = async (req, res) => {
    const module = await moduleService.updateModule(
        req.params.moduleId,
        req.params.courseId,
        req.body
    );
    return res.status(200).json(module);
};

export const deleteModule = async (req, res) => {
    await moduleService.deleteModule(req.params.moduleId, req.params.courseId, req.user?.id);
    return res.status(200).json({ message: 'Module deactivated' });
};

export const getLessonsByModule = async (req, res) => {
    const data = await lessonService.getLessonsByModule(req.params.moduleId, req.params.courseId);
    return res.status(200).json(data);
};

export const getLessonById = async (req, res) => {
    const data = await lessonService.getLessonById(req.params.lessonId, req.params.courseId);
    return res.status(200).json(data);
};

export const createLesson = async (req, res) => {
    const lesson = await lessonService.createLesson(
        req.params.moduleId,
        req.params.courseId,
        req.body
    );
    return res.status(201).json(lesson);
};

export const updateLesson = async (req, res) => {
    const lesson = await lessonService.updateLesson(
        req.params.lessonId,
        req.params.courseId,
        req.body
    );
    return res.status(200).json(lesson);
};

export const deleteLesson = async (req, res) => {
    await lessonService.deleteLesson(req.params.lessonId, req.params.courseId, req.user?.id);
    return res.status(200).json({ message: 'Lesson deactivated' });
};
