import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { paginationMiddleware } from '../middlewares/pagination.middleware.js';
import {
    getMe,
    updateMe,
    changePassword,
    getMyClasses,
    getMyPayments,
    getMyResults,
    getMyJournals,
    getMyAnnouncements,
    getMyLearningReport,
} from '../controllers/profile/profile.controller.js';
import {
    getMyProgressByCourse,
    getMyLessonProgress,
    updateMyLessonProgress,
    markLessonCompleted,
} from '../controllers/progress/progress.controller.js';
import { getMyCalendarEvents } from '../controllers/calendar/calendar.controller.js';
import { getMyNotifications, markAsRead, markAllAsRead } from '../controllers/notification/notification.controller.js';
import { getMyCompletions, getCertificate } from '../controllers/completion/completion.controller.js';

const profileRouter = express.Router();

profileRouter.use(verifyToken);

profileRouter.get('/', getMe);
profileRouter.put('/', updateMe);
profileRouter.put('/change-password', changePassword);
profileRouter.get('/classes', paginationMiddleware, getMyClasses);
profileRouter.get('/payments', paginationMiddleware, getMyPayments);
profileRouter.get('/results', paginationMiddleware, getMyResults);
profileRouter.get('/journals', paginationMiddleware, getMyJournals);
profileRouter.get('/announcements', paginationMiddleware, getMyAnnouncements);
profileRouter.get('/learning-report', getMyLearningReport);

// Lesson progress (student)
profileRouter.get('/progress/courses/:courseId', getMyProgressByCourse);
profileRouter.get('/progress/lessons/:lessonId', getMyLessonProgress);
profileRouter.post('/progress/lessons/:lessonId', updateMyLessonProgress);
profileRouter.post('/progress/lessons/:lessonId/complete', markLessonCompleted);

profileRouter.get('/calendar', getMyCalendarEvents);

profileRouter.get('/notifications', paginationMiddleware, getMyNotifications);
profileRouter.patch('/notifications/read-all', markAllAsRead);
profileRouter.patch('/notifications/:id/read', markAsRead);

profileRouter.get('/completions', getMyCompletions);
profileRouter.get('/certificate/:courseId', getCertificate);

export default profileRouter;
