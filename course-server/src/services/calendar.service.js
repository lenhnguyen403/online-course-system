import Enrollment from '../models/enrollment.model.js';
import Class from '../models/class.model.js';
import Assignment from '../models/assignment.model.js';
import { Exam } from '../models/exam.model.js';
import { ROLE } from '../constants/Role.js';
import { ENROLL_STATUS } from '../constants/EnrollStatus.js';

/**
 * Get calendar events for a date range. Events: assignments (dueDate), exams (examDate).
 * @param {string} userId
 * @param {string} role - student | teacher
 * @param {Date} start
 * @param {Date} end
 */
export const getCalendarEvents = async (userId, role, start, end) => {
    let classIds = [];
    const classMap = {};

    if (role === ROLE.STUDENT) {
        const enrollments = await Enrollment.find({
            studentId: userId,
            status: ENROLL_STATUS.ACTIVE,
        })
            .populate('classId', 'className classCode')
            .lean();
        enrollments.forEach((e) => {
            if (e.classId) {
                classIds.push(e.classId._id);
                classMap[e.classId._id.toString()] = e.classId;
            }
        });
    } else if (role === ROLE.TEACHER) {
        const classes = await Class.find({ teacherIds: userId }).select('className classCode').lean();
        classIds = classes.map((c) => c._id);
        classes.forEach((c) => { classMap[c._id.toString()] = c; });
    } else {
        return { events: [] };
    }

    if (classIds.length === 0) return { events: [] };

    const [assignments, exams] = await Promise.all([
        Assignment.find({
            classId: { $in: classIds },
            dueDate: { $gte: start, $lte: end },
        }).lean(),
        Exam.find({
            classId: { $in: classIds },
            examDate: { $gte: start, $lte: end },
        }).lean(),
    ]);

    const events = [];

    assignments.forEach((a) => {
        const cls = classMap[a.classId?.toString()];
        events.push({
            type: 'assignment',
            id: a._id,
            assignmentId: a._id,
            classId: a.classId,
            className: cls?.className || '',
            title: a.title,
            date: a.dueDate,
            description: a.description || '',
        });
    });

    exams.forEach((e) => {
        const cls = classMap[e.classId?.toString()];
        events.push({
            type: 'exam',
            id: e._id,
            examId: e._id,
            classId: e.classId,
            className: cls?.className || '',
            title: e.title,
            date: e.examDate,
            examType: e.examType,
        });
    });

    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    return { events };
};
