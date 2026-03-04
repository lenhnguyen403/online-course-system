import * as quizAttemptService from '../../services/quizAttempt.service.js';

export const getQuestionsForStudent = async (req, res) => {
    const data = await quizAttemptService.getQuestionsByExamForStudent(
        req.params.examId,
        req.user.id
    );
    return res.status(200).json(data);
};

export const submitAttempt = async (req, res) => {
    const attempt = await quizAttemptService.submitQuizAttempt(
        req.params.examId,
        req.user.id,
        req.body.answers || req.body
    );
    return res.status(201).json(attempt);
};

export const getMyAttempt = async (req, res) => {
    const data = await quizAttemptService.getMyAttemptForExam(req.params.examId, req.user.id);
    return res.status(200).json(data || null);
};

export const getAttemptsByExam = async (req, res) => {
    const result = await quizAttemptService.getAttemptsByExam(
        req.params.examId,
        req.pagination
    );
    return res.status(200).json(result);
};

export const getAttemptById = async (req, res) => {
    const data = await quizAttemptService.getAttemptById(
        req.params.attemptId,
        req.params.examId
    );
    return res.status(200).json(data);
};
