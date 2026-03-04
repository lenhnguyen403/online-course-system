import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authMiddleware } from '../middlewares/role.middleware.js';
import { paginationMiddleware } from '../middlewares/pagination.middleware.js';
import {
    getCourses,
    createCourse,
    getCourseById,
    updateCourse,
    deactivateCourse,
} from '../controllers/course/course.controller.js';

const courseRouter = express.Router();

courseRouter.use(verifyToken);
courseRouter.use(authMiddleware('admin', 'staff'));
courseRouter.use(paginationMiddleware);

courseRouter.get('/', getCourses);
courseRouter.post('/', createCourse);
courseRouter.get('/:id', getCourseById);
courseRouter.put('/:id', updateCourse);
courseRouter.patch('/:id/deactivate', deactivateCourse);

export default courseRouter;
