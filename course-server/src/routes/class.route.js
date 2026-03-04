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
const adminStaffTeacher = ['admin', 'staff', 'teacher'];

classRouter.use(verifyToken);
classRouter.use(paginationMiddleware);

// Giảng viên chỉ xem danh sách lớp của mình (Feature 4, 5)
classRouter.get('/', authMiddleware(...adminStaffTeacher), getClasses);
classRouter.get('/:id', authMiddleware(...adminStaffTeacher), getClassById);

classRouter.post('/', authMiddleware(...adminStaff), createClass);
classRouter.put('/:id', authMiddleware(...adminStaff), updateClass);
classRouter.patch('/:id/deactivate', authMiddleware(...adminStaff), deactivateClass);

// Students - teacher có thể xem HV trong lớp mình (Feature 5, 6, 7)
classRouter.get('/:classId/students', authMiddleware(...adminStaffTeacher), getClassStudents);
classRouter.get('/:classId/students/:studentId', authMiddleware(...adminStaffTeacher), getClassStudentById);
classRouter.post('/:classId/students', authMiddleware(...adminStaff), addStudentToClass);
classRouter.patch('/:classId/students/:studentId', authMiddleware(...adminStaff), updateClassStudent);
classRouter.patch('/:classId/students/:studentId/status', authMiddleware(...adminStaff), updateClassStudentStatus);
classRouter.delete('/:classId/students/:studentId', authMiddleware(...adminStaff), removeStudentFromClass);

// Teachers
classRouter.get('/:classId/teachers', authMiddleware(...adminStaffTeacher), getClassTeachers);
classRouter.post('/:classId/teachers', authMiddleware(...adminStaff), addTeacherToClass);
classRouter.delete('/:classId/teachers/:teacherId', authMiddleware(...adminStaff), removeTeacherFromClass);

export default classRouter;
