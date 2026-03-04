import * as courseService from '../../services/course.service.js';

export const getCourses = async (req, res) => {
    const filter = {};
    if (req.query.subjectId) filter.subjectId = req.query.subjectId;
    const result = await courseService.getCourses(req.pagination, filter);
    return res.status(200).json(result);
};

export const createCourse = async (req, res) => {
    const course = await courseService.createCourse(req.body);
    return res.status(201).json(course);
};

export const getCourseById = async (req, res) => {
    const course = await courseService.getCourseById(req.params.id);
    return res.status(200).json(course);
};

export const updateCourse = async (req, res) => {
    const course = await courseService.updateCourse(req.params.id, req.body);
    return res.status(200).json(course);
};

export const deactivateCourse = async (req, res) => {
    const course = await courseService.deactivateCourse(req.params.id, req.user?.id);
    return res.status(200).json(course);
};
