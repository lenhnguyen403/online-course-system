import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authMiddleware } from '../middlewares/role.middleware.js';
import { paginationMiddleware } from '../middlewares/pagination.middleware.js';
import {
    getExamsByClass,
    createExam,
    getExamById,
    updateExam,
    deleteExam,
    getExamResults,
    createExamResult,
    bulkCreateExamResults,
    updateExamResult,
    getStudentResults,
    getStudentAverageScore,
    getClassAverageScore,
} from '../controllers/exam/exam.controller.js';
import {
    getQuestionsByExam,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    bulkCreateQuestions,
} from '../controllers/question/question.controller.js';
import {
    getQuestionsForStudent,
    submitAttempt,
    getMyAttempt,
    getAttemptsByExam,
    getAttemptById,
} from '../controllers/quizAttempt/quizAttempt.controller.js';

const examRouter = express.Router();
const adminStaffTeacher = ['admin', 'staff', 'teacher'];

examRouter.use(verifyToken);
examRouter.use(paginationMiddleware);

examRouter.get('/classes/:classId/exams', getExamsByClass);
examRouter.post('/classes/:classId/exams', authMiddleware('admin', 'staff', 'teacher'), createExam);
examRouter.get('/exams/:examId', getExamById);
examRouter.put('/exams/:examId', authMiddleware('admin', 'staff', 'teacher'), updateExam);
examRouter.delete('/exams/:examId', authMiddleware('admin', 'staff', 'teacher'), deleteExam);

examRouter.get('/exams/:examId/results', getExamResults);
examRouter.post('/exams/:examId/results', authMiddleware('admin', 'staff', 'teacher'), createExamResult);
examRouter.post('/exams/:examId/results/bulk', authMiddleware('admin', 'staff', 'teacher'), bulkCreateExamResults);
examRouter.put('/exams/:examId/results/:studentId', authMiddleware('admin', 'staff', 'teacher'), updateExamResult);

examRouter.get('/students/:studentId/results', getStudentResults);
examRouter.get('/students/:studentId/average-score', getStudentAverageScore);
examRouter.get('/classes/:classId/average-score', getClassAverageScore);

// Questions (quiz bank) - teacher
examRouter.get('/exams/:examId/questions', authMiddleware(...adminStaffTeacher), getQuestionsByExam);
examRouter.get('/exams/:examId/questions/:questionId', authMiddleware(...adminStaffTeacher), getQuestionById);
examRouter.post('/exams/:examId/questions', authMiddleware(...adminStaffTeacher), createQuestion);
examRouter.post('/exams/:examId/questions/bulk', authMiddleware(...adminStaffTeacher), bulkCreateQuestions);
examRouter.put('/exams/:examId/questions/:questionId', authMiddleware(...adminStaffTeacher), updateQuestion);
examRouter.patch('/exams/:examId/questions/:questionId/deactivate', authMiddleware(...adminStaffTeacher), deleteQuestion);

// Quiz take & submit - student
examRouter.get('/exams/:examId/quiz', authMiddleware('student'), getQuestionsForStudent);
examRouter.post('/exams/:examId/quiz/submit', authMiddleware('student'), submitAttempt);
examRouter.get('/exams/:examId/quiz/my-attempt', authMiddleware('student'), getMyAttempt);

// Quiz attempts list - teacher
examRouter.get('/exams/:examId/attempts', authMiddleware(...adminStaffTeacher), getAttemptsByExam);
examRouter.get('/exams/:examId/attempts/:attemptId', authMiddleware(...adminStaffTeacher), getAttemptById);

export default examRouter;
