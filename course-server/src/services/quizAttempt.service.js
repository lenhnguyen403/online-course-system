import QuizAttempt from '../models/quizAttempt.model.js';
import Question from '../models/question.model.js';
import { Exam } from '../models/exam.model.js';
import Enrollment from '../models/enrollment.model.js';
import { ENROLL_STATUS } from '../constants/EnrollStatus.js';

async function calculateScore(examId, answers) {
    const questions = await Question.find({ examId }).sort({ order: 1 }).lean();
    let score = 0;
    let maxScore = 0;
    const byId = {};
    questions.forEach((q) => { byId[q._id.toString()] = q; maxScore += q.maxScore || 1; });
    (answers || []).forEach((a) => {
        const q = byId[a.questionId?.toString()];
        if (!q || !q.options || q.options.length === 0) return;
        const idx = Number(a.optionIndex);
        if (q.options[idx]?.isCorrect) score += q.maxScore || 1;
    });
    return { score, maxScore };
}

export const getQuestionsByExamForStudent = async (examId, studentId) => {
    const exam = await Exam.findById(examId).populate('classId').lean();
    if (!exam) throw { status: 404, message: 'Exam not found' };
    const enrolled = await Enrollment.findOne({
        classId: exam.classId._id,
        studentId,
        status: ENROLL_STATUS.ACTIVE,
    });
    if (!enrolled) throw { status: 403, message: 'Not enrolled in this class' };
    const questions = await Question.find({ examId })
        .sort({ order: 1 })
        .select('order type questionText options maxScore')
        .lean();
    return questions.map((q) => ({
        _id: q._id,
        order: q.order,
        type: q.type,
        questionText: q.questionText,
        options: (q.options || []).map((o) => ({ text: o.text })),
        maxScore: q.maxScore,
    }));
};

export const submitQuizAttempt = async (examId, studentId, answers) => {
    const exam = await Exam.findById(examId).populate('classId').lean();
    if (!exam) throw { status: 404, message: 'Exam not found' };
    const enrolled = await Enrollment.findOne({
        classId: exam.classId._id,
        studentId,
        status: ENROLL_STATUS.ACTIVE,
    });
    if (!enrolled) throw { status: 403, message: 'Not enrolled in this class' };
    const existing = await QuizAttempt.findOne({ examId, studentId });
    if (existing) throw { status: 400, message: 'Already submitted' };
    const { score, maxScore } = await calculateScore(examId, answers);
    const attempt = await QuizAttempt.create({
        examId,
        studentId,
        answers: answers || [],
        score,
        maxScore,
    });
    await attempt.populate('studentId', 'fullName email');
    return attempt;
};

export const getAttemptById = async (attemptId, examId) => {
    const attempt = await QuizAttempt.findOne({ _id: attemptId, examId })
        .populate('studentId', 'fullName email')
        .lean();
    if (!attempt) throw { status: 404, message: 'Attempt not found' };
    return attempt;
};

export const getAttemptsByExam = async (examId, pagination) => {
    await Exam.findById(examId).orFail(() => { throw { status: 404, message: 'Exam not found' }; });
    const [data, total] = await Promise.all([
        QuizAttempt.find({ examId })
            .populate('studentId', 'fullName email')
            .skip(pagination.offset)
            .limit(pagination.limit)
            .sort({ submittedAt: -1 })
            .lean(),
        QuizAttempt.countDocuments({ examId }),
    ]);
    return { data, total, ...pagination };
};

export const getMyAttemptForExam = async (examId, studentId) => {
    const attempt = await QuizAttempt.findOne({ examId, studentId })
        .lean();
    return attempt;
};
