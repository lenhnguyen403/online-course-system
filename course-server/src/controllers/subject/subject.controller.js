import * as subjectService from '../../services/subject.service.js';

export const getSubjects = async (req, res) => {
    const result = await subjectService.getSubjects(req.pagination);
    return res.status(200).json(result);
};

export const createSubject = async (req, res) => {
    const subject = await subjectService.createSubject(req.body);
    return res.status(201).json(subject);
};

export const getSubjectById = async (req, res) => {
    const subject = await subjectService.getSubjectById(req.params.id);
    return res.status(200).json(subject);
};

export const updateSubject = async (req, res) => {
    const subject = await subjectService.updateSubject(req.params.id, req.body);
    return res.status(200).json(subject);
};

export const deactivateSubject = async (req, res) => {
    const subject = await subjectService.deactivateSubject(req.params.id, req.user?.id);
    return res.status(200).json(subject);
};
