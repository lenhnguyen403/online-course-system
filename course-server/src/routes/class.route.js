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
import {
    getAssignmentsByClass,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getSubmissionsByAssignment,
    getSubmissionById,
    createSubmission,
    updateSubmissionGrade,
    uploadSubmissionFile,
} from '../controllers/assignment/assignment.controller.js';
import upload from '../middlewares/multer.middleware.js';
import {
    getAnnouncementsByClass,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
} from '../controllers/announcement/announcement.controller.js';
import { getMessagesByClass, createMessage } from '../controllers/message/message.controller.js';

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

// Assignments
classRouter.get('/:classId/assignments', authMiddleware(...adminStaffTeacher, 'student'), getAssignmentsByClass);
classRouter.post('/:classId/assignments', authMiddleware(...adminStaffTeacher), createAssignment);
classRouter.post('/:classId/assignments/upload', authMiddleware('student'), upload.single('file'), uploadSubmissionFile);
classRouter.get('/:classId/assignments/:assignmentId', authMiddleware(...adminStaffTeacher, 'student'), getAssignmentById);
classRouter.put('/:classId/assignments/:assignmentId', authMiddleware(...adminStaffTeacher), updateAssignment);
classRouter.patch('/:classId/assignments/:assignmentId/deactivate', authMiddleware(...adminStaffTeacher), deleteAssignment);
classRouter.get('/:classId/assignments/:assignmentId/submissions', authMiddleware(...adminStaffTeacher), paginationMiddleware, getSubmissionsByAssignment);
classRouter.get('/:classId/assignments/:assignmentId/submissions/:submissionId', authMiddleware(...adminStaffTeacher, 'student'), getSubmissionById);
classRouter.post('/:classId/assignments/:assignmentId/submit', authMiddleware('student'), createSubmission);
classRouter.put('/:classId/assignments/:assignmentId/submissions/:submissionId/grade', authMiddleware(...adminStaffTeacher), updateSubmissionGrade);

// Announcements
classRouter.get('/:classId/announcements', authMiddleware(...adminStaffTeacher, 'student'), getAnnouncementsByClass);
classRouter.post('/:classId/announcements', authMiddleware(...adminStaffTeacher), createAnnouncement);
classRouter.get('/:classId/announcements/:announcementId', authMiddleware(...adminStaffTeacher, 'student'), getAnnouncementById);
classRouter.put('/:classId/announcements/:announcementId', authMiddleware(...adminStaffTeacher), updateAnnouncement);
classRouter.patch('/:classId/announcements/:announcementId/deactivate', authMiddleware(...adminStaffTeacher), deleteAnnouncement);

// Chat (GV - HV trong lớp)
classRouter.get('/:classId/messages', authMiddleware(...adminStaffTeacher, 'student'), getMessagesByClass);
classRouter.post('/:classId/messages', authMiddleware(...adminStaffTeacher, 'student'), createMessage);

export default classRouter;
