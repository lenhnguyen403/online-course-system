import * as examService from '../../services/exam.service.js';

export const getExamsByClass = async (req, res) => {
    const exams = await examService.getExamsByClass(req.params.classId);
    return res.status(200).json(exams);
};

export const createExam = async (req, res) => {
    const exam = await examService.createExam(req.params.classId, req.body);
    return res.status(201).json(exam);
};

export const getExamById = async (req, res) => {
    const exam = await examService.getExamById(req.params.examId);
    return res.status(200).json(exam);
};

export const updateExam = async (req, res) => {
    const exam = await examService.updateExam(req.params.examId, req.body);
    return res.status(200).json(exam);
};

export const deleteExam = async (req, res) => {
    const result = await examService.deleteExam(req.params.examId);
    return res.status(200).json(result);
};

export const getExamResults = async (req, res) => {
    const result = await examService.getExamResults(req.params.examId, req.pagination);
    return res.status(200).json(result);
};

export const createExamResult = async (req, res) => {
    const result = await examService.createExamResult(req.params.examId, req.body, req.user?.id);
    return res.status(201).json(result);
};

export const bulkCreateExamResults = async (req, res) => {
    const results = await examService.bulkCreateExamResults(req.params.examId, req.body.results || req.body, req.user?.id);
    return res.status(201).json(results);
};

export const updateExamResult = async (req, res) => {
    const result = await examService.updateExamResult(req.params.examId, req.params.studentId, req.body);
    return res.status(200).json(result);
};

export const getStudentResults = async (req, res) => {
    const result = await examService.getStudentResults(req.params.studentId, req.pagination);
    return res.status(200).json(result);
};

export const getStudentAverageScore = async (req, res) => {
    const result = await examService.getStudentAverageScore(req.params.studentId);
    return res.status(200).json(result);
};

export const getClassAverageScore = async (req, res) => {
    const result = await examService.getClassAverageScore(req.params.classId);
    return res.status(200).json(result);
};
