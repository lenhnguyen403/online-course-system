import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authMiddleware } from '../middlewares/role.middleware.js';
import { paginationMiddleware } from '../middlewares/pagination.middleware.js';
import {
    getClasses,
    createClass,
    getClassById,
    updateClass,
    deactivateClass,
    getClassStudents,
    addStudentToClass,
    getClassStudentById,
    updateClassStudent,
    updateClassStudentStatus,
    removeStudentFromClass,
    getClassTeachers,
    addTeacherToClass,
    removeTeacherFromClass,
} from '../controllers/class/class.controller.js';

const classRouter = express.Router();

const adminStaff = ['admin', 'staff'];
classRouter.use(verifyToken);
classRouter.use(authMiddleware(...adminStaff));
classRouter.use(paginationMiddleware);

classRouter.get('/', getClasses);
classRouter.post('/', createClass);
classRouter.get('/:id', getClassById);
classRouter.put('/:id', updateClass);
classRouter.patch('/:id/deactivate', deactivateClass);

// Students - use :classId to match api.txt (same as :id for single class)
classRouter.get('/:classId/students', getClassStudents);
classRouter.post('/:classId/students', addStudentToClass);
classRouter.get('/:classId/students/:studentId', getClassStudentById);
classRouter.patch('/:classId/students/:studentId', updateClassStudent);
classRouter.patch('/:classId/students/:studentId/status', updateClassStudentStatus);
classRouter.delete('/:classId/students/:studentId', removeStudentFromClass);

// Teachers
classRouter.get('/:classId/teachers', getClassTeachers);
classRouter.post('/:classId/teachers', addTeacherToClass);
classRouter.delete('/:classId/teachers/:teacherId', removeTeacherFromClass);

export default classRouter;
