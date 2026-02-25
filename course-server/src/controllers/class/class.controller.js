import * as classService from '../../services/class.service.js';

export const getClasses = async (req, res) => {
    const result = await classService.getClasses(req.pagination);
    return res.status(200).json(result);
};

export const createClass = async (req, res) => {
    const cls = await classService.createClass(req.body);
    return res.status(201).json(cls);
};

export const getClassById = async (req, res) => {
    const cls = await classService.getClassById(req.params.id);
    return res.status(200).json(cls);
};

export const updateClass = async (req, res) => {
    const cls = await classService.updateClass(req.params.id, req.body);
    return res.status(200).json(cls);
};

export const deactivateClass = async (req, res) => {
    const cls = await classService.deactivateClass(req.params.id, req.user?.id);
    return res.status(200).json(cls);
};

// Students
export const getClassStudents = async (req, res) => {
    const status = req.query.status;
    const result = await classService.getClassStudents(req.params.classId, req.pagination, status);
    return res.status(200).json(result);
};

export const addStudentToClass = async (req, res) => {
    const { studentId } = req.body;
    const enrollment = await classService.addStudentToClass(req.params.classId, studentId);
    return res.status(201).json(enrollment);
};

export const getClassStudentById = async (req, res) => {
    const enrollment = await classService.getClassStudentById(req.params.classId, req.params.studentId);
    return res.status(200).json(enrollment);
};

export const updateClassStudent = async (req, res) => {
    const enrollment = await classService.updateClassStudent(req.params.classId, req.params.studentId, req.body);
    return res.status(200).json(enrollment);
};

export const updateClassStudentStatus = async (req, res) => {
    const { status } = req.body;
    const enrollment = await classService.updateClassStudentStatus(req.params.classId, req.params.studentId, status);
    return res.status(200).json(enrollment);
};

export const removeStudentFromClass = async (req, res) => {
    const result = await classService.removeStudentFromClass(req.params.classId, req.params.studentId);
    return res.status(200).json(result);
};

// Teachers
export const getClassTeachers = async (req, res) => {
    const teachers = await classService.getClassTeachers(req.params.classId);
    return res.status(200).json(teachers);
};

export const addTeacherToClass = async (req, res) => {
    const { teacherId } = req.body;
    const teachers = await classService.addTeacherToClass(req.params.classId, teacherId);
    return res.status(201).json(teachers);
};

export const removeTeacherFromClass = async (req, res) => {
    const result = await classService.removeTeacherFromClass(req.params.classId, req.params.teacherId);
    return res.status(200).json(result);
};
