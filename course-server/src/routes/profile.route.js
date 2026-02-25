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
} from '../controllers/profile/profile.controller.js';

const profileRouter = express.Router();

profileRouter.use(verifyToken);

profileRouter.get('/', getMe);
profileRouter.put('/', updateMe);
profileRouter.put('/change-password', changePassword);
profileRouter.get('/classes', paginationMiddleware, getMyClasses);
profileRouter.get('/payments', paginationMiddleware, getMyPayments);
profileRouter.get('/results', paginationMiddleware, getMyResults);
profileRouter.get('/journals', paginationMiddleware, getMyJournals);

export default profileRouter;
