import Question from '../models/question.model.js';
import { Exam } from '../models/exam.model.js';

export const getQuestionsByExam = async (examId) => {
    await Exam.findById(examId).orFail(() => { throw { status: 404, message: 'Exam not found' }; });
    const questions = await Question.find({ examId }).sort({ order: 1 }).lean();
    return questions;
};

export const getQuestionById = async (questionId, examId) => {
    const question = await Question.findOne({ _id: questionId, examId }).lean();
    if (!question) throw { status: 404, message: 'Question not found' };
    return question;
};

export const createQuestion = async (examId, body) => {
    await Exam.findById(examId).orFail(() => { throw { status: 404, message: 'Exam not found' }; });
    const maxOrder = await Question.findOne({ examId }).sort({ order: -1 }).select('order').lean();
    const order = (maxOrder?.order ?? -1) + 1;
    const question = await Question.create({ ...body, examId, order });
    return question;
};

export const updateQuestion = async (questionId, examId, body) => {
    const allowed = ['questionText', 'type', 'options', 'maxScore', 'order'];
    const update = {};
    allowed.forEach((k) => { if (body[k] !== undefined) update[k] = body[k]; });
    const question = await Question.findOneAndUpdate(
        { _id: questionId, examId },
        update,
        { new: true }
    );
    if (!question) throw { status: 404, message: 'Question not found' };
    return question;
};

export const deleteQuestion = async (questionId, examId, userId) => {
    const question = await Question.findOne({ _id: questionId, examId });
    if (!question) throw { status: 404, message: 'Question not found' };
    await question.softDelete(userId);
    return question;
};

export const bulkCreateQuestions = async (examId, items) => {
    await Exam.findById(examId).orFail(() => { throw { status: 404, message: 'Exam not found' }; });
    const withOrder = items.map((item, i) => ({ ...item, examId, order: i }));
    const questions = await Question.insertMany(withOrder);
    return questions;
};
