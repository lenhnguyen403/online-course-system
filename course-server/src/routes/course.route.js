import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authMiddleware } from '../middlewares/role.middleware.js';
import { paginationMiddleware } from '../middlewares/pagination.middleware.js';
import { requireCourseAccess, requireCourseManage } from '../middlewares/courseAccess.middleware.js';
import {
    getCourses,
    createCourse,
    getCourseById,
    updateCourse,
    deactivateCourse,
} from '../controllers/course/course.controller.js';
import {
    getModulesByCourse,
    getModuleById,
    createModule,
    updateModule,
    deleteModule,
    getLessonsByModule,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
} from '../controllers/content/content.controller.js';

const courseRouter = express.Router();
const adminStaff = ['admin', 'staff'];
const adminStaffTeacherStudent = ['admin', 'staff', 'teacher', 'student'];
const adminStaffTeacher = ['admin', 'staff', 'teacher'];

courseRouter.use(verifyToken);
courseRouter.use(paginationMiddleware);

// --- Content (modules/lessons): longer paths first ---
courseRouter.get('/:courseId/modules', authMiddleware(...adminStaffTeacherStudent), requireCourseAccess, getModulesByCourse);
courseRouter.post('/:courseId/modules', authMiddleware(...adminStaffTeacher), requireCourseManage, createModule);
courseRouter.get('/:courseId/modules/:moduleId', authMiddleware(...adminStaffTeacherStudent), requireCourseAccess, getModuleById);
courseRouter.put('/:courseId/modules/:moduleId', authMiddleware(...adminStaffTeacher), requireCourseManage, updateModule);
courseRouter.patch('/:courseId/modules/:moduleId/deactivate', authMiddleware(...adminStaffTeacher), requireCourseManage, deleteModule);
courseRouter.get('/:courseId/modules/:moduleId/lessons', authMiddleware(...adminStaffTeacherStudent), requireCourseAccess, getLessonsByModule);
courseRouter.post('/:courseId/modules/:moduleId/lessons', authMiddleware(...adminStaffTeacher), requireCourseManage, createLesson);
courseRouter.get('/:courseId/lessons/:lessonId', authMiddleware(...adminStaffTeacherStudent), requireCourseAccess, getLessonById);
courseRouter.put('/:courseId/lessons/:lessonId', authMiddleware(...adminStaffTeacher), requireCourseManage, updateLesson);
courseRouter.patch('/:courseId/lessons/:lessonId/deactivate', authMiddleware(...adminStaffTeacher), requireCourseManage, deleteLesson);

// --- Course CRUD (admin/staff only) ---
courseRouter.get('/', authMiddleware(...adminStaff), getCourses);
courseRouter.post('/', authMiddleware(...adminStaff), createCourse);
courseRouter.get('/:id', authMiddleware(...adminStaff), getCourseById);
courseRouter.put('/:id', authMiddleware(...adminStaff), updateCourse);
courseRouter.patch('/:id/deactivate', authMiddleware(...adminStaff), deactivateCourse);

export default courseRouter;
