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

const examRouter = express.Router();

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

export default examRouter;
