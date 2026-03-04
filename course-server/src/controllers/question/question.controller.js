import * as questionService from '../../services/question.service.js';

export const getQuestionsByExam = async (req, res) => {
    const data = await questionService.getQuestionsByExam(req.params.examId);
    return res.status(200).json(data);
};

export const getQuestionById = async (req, res) => {
    const data = await questionService.getQuestionById(req.params.questionId, req.params.examId);
    return res.status(200).json(data);
};

export const createQuestion = async (req, res) => {
    const question = await questionService.createQuestion(req.params.examId, req.body);
    return res.status(201).json(question);
};

export const updateQuestion = async (req, res) => {
    const question = await questionService.updateQuestion(
        req.params.questionId,
        req.params.examId,
        req.body
    );
    return res.status(200).json(question);
};

export const deleteQuestion = async (req, res) => {
    await questionService.deleteQuestion(
        req.params.questionId,
        req.params.examId,
        req.user?.id
    );
    return res.status(200).json({ message: 'Question deactivated' });
};

export const bulkCreateQuestions = async (req, res) => {
    const questions = await questionService.bulkCreateQuestions(
        req.params.examId,
        req.body.questions || req.body
    );
    return res.status(201).json(questions);
};
