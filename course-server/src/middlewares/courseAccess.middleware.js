import * as contentAccessService from '../services/contentAccess.service.js';

/** Require user to have read access to course (admin, staff, or teacher/student with access). Sets req.courseId. */
export const requireCourseAccess = (req, res, next) => {
    const courseId = req.params.courseId || req.params.id;
    if (!courseId) return res.status(400).json({ message: 'Course ID required' });
    contentAccessService
        .canAccessCourse(req.user?.id, req.user?.role, courseId)
        .then((allowed) => {
            if (!allowed) return res.status(403).json({ message: 'Forbidden' });
            req.courseId = courseId;
            next();
        })
        .catch(next);
};

/** Require user to have manage access to course content (admin, staff, or teacher of a class with this course). */
export const requireCourseManage = (req, res, next) => {
    const courseId = req.params.courseId || req.params.id;
    if (!courseId) return res.status(400).json({ message: 'Course ID required' });
    contentAccessService
        .canManageCourseContent(req.user?.id, req.user?.role, courseId)
        .then((allowed) => {
            if (!allowed) return res.status(403).json({ message: 'Forbidden' });
            req.courseId = courseId;
            next();
        })
        .catch(next);
};
