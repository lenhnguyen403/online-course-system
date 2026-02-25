import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authMiddleware } from '../middlewares/role.middleware.js';
import { paginationMiddleware } from '../middlewares/pagination.middleware.js';
import {
    getSubjects,
    createSubject,
    getSubjectById,
    updateSubject,
    deactivateSubject,
} from '../controllers/subject/subject.controller.js';

const subjectRouter = express.Router();

subjectRouter.get('/', paginationMiddleware, getSubjects);
subjectRouter.post('/', verifyToken, authMiddleware('admin', 'staff'), createSubject);
subjectRouter.get('/:id', getSubjectById);
subjectRouter.put('/:id', verifyToken, authMiddleware('admin', 'staff'), updateSubject);
subjectRouter.patch('/:id/deactivate', verifyToken, authMiddleware('admin', 'staff'), deactivateSubject);

export default subjectRouter;