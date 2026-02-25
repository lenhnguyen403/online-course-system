import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authMiddleware } from '../middlewares/role.middleware.js';
import { paginationMiddleware } from '../middlewares/pagination.middleware.js';
import {
    getAdminDashboard,
    getTeacherDashboard,
    getStudentDashboard,
    getClassDashboard,
    getAuditLogs,
} from '../controllers/dashboard/dashboard.controller.js';

const dashboardRouter = express.Router();

dashboardRouter.use(verifyToken);

dashboardRouter.get('/audit-logs', authMiddleware('admin', 'staff'), paginationMiddleware, getAuditLogs);
dashboardRouter.get('/admin', authMiddleware('admin', 'staff'), getAdminDashboard);
dashboardRouter.get('/teacher', authMiddleware('admin', 'staff', 'teacher'), getTeacherDashboard);
dashboardRouter.get('/student', authMiddleware('admin', 'staff', 'student'), getStudentDashboard);
dashboardRouter.get('/class', authMiddleware('admin', 'staff'), getClassDashboard);

export default dashboardRouter;
