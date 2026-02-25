import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authMiddleware } from '../middlewares/role.middleware.js';
import {
    getTeacherStudentCount,
    getClassPerformance,
    getStudentProgress,
    getFinancial,
    getClassScoreChart,
    getTeacherMonthly,
} from '../controllers/report/report.controller.js';

const reportRouter = express.Router();

reportRouter.use(verifyToken);
reportRouter.use(authMiddleware('admin', 'staff'));

reportRouter.get('/teacher-student-count', getTeacherStudentCount);
reportRouter.get('/class-performance/:classId', getClassPerformance);
reportRouter.get('/student-progress/:studentId', getStudentProgress);
reportRouter.get('/financial', getFinancial);
reportRouter.get('/class-score-chart/:classId', getClassScoreChart);
reportRouter.get('/teacher-monthly/:month', getTeacherMonthly);

export default reportRouter;
