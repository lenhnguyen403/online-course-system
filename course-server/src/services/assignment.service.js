import Assignment from '../models/assignment.model.js';
import Submission from '../models/submission.model.js';
import Class from '../models/class.model.js';
import Enrollment from '../models/enrollment.model.js';
import { ENROLL_STATUS } from '../constants/EnrollStatus.js';
import * as notificationService from './notification.service.js';

export const getAssignmentsByClass = async (classId) => {
    await Class.findById(classId).orFail(() => { throw { status: 404, message: 'Class not found' }; });
    const assignments = await Assignment.find({ classId })
        .populate('createdBy', 'fullName')
        .sort({ dueDate: 1, createdAt: -1 })
        .lean();
    return assignments;
};

export const getAssignmentById = async (assignmentId, classId) => {
    const assignment = await Assignment.findOne({ _id: assignmentId, classId })
        .populate('createdBy', 'fullName')
        .lean();
    if (!assignment) throw { status: 404, message: 'Assignment not found' };
    return assignment;
};

export const createAssignment = async (classId, body, userId) => {
    await Class.findById(classId).orFail(() => { throw { status: 404, message: 'Class not found' }; });
    const assignment = await Assignment.create({ ...body, classId, createdBy: userId });
    await assignment.populate('createdBy', 'fullName');
    return assignment;
};

export const updateAssignment = async (assignmentId, classId, body) => {
    const allowed = ['title', 'description', 'dueDate', 'maxScore', 'allowLate', 'rubric'];
    const update = {};
    allowed.forEach((k) => { if (body[k] !== undefined) update[k] = body[k]; });
    const assignment = await Assignment.findOneAndUpdate(
        { _id: assignmentId, classId },
        update,
        { new: true }
    ).populate('createdBy', 'fullName');
    if (!assignment) throw { status: 404, message: 'Assignment not found' };
    return assignment;
};

export const deleteAssignment = async (assignmentId, classId, userId) => {
    const assignment = await Assignment.findOne({ _id: assignmentId, classId });
    if (!assignment) throw { status: 404, message: 'Assignment not found' };
    await assignment.softDelete(userId);
    return assignment;
};

export const getSubmissionsByAssignment = async (assignmentId, classId, pagination) => {
    await getAssignmentById(assignmentId, classId);
    const [data, total] = await Promise.all([
        Submission.find({ assignmentId })
            .populate('studentId', 'fullName email')
            .populate('gradedBy', 'fullName')
            .skip(pagination.offset)
            .limit(pagination.limit)
            .sort({ submittedAt: -1 })
            .lean(),
        Submission.countDocuments({ assignmentId }),
    ]);
    return { data, total, ...pagination };
};

export const getMySubmissionsByClass = async (studentId, classId) => {
    const enrolled = await Enrollment.findOne({ classId, studentId, status: ENROLL_STATUS.ACTIVE });
    if (!enrolled) throw { status: 403, message: 'Not enrolled in this class' };
    const assignments = await Assignment.find({ classId }).sort({ dueDate: 1 }).lean();
    const assignmentIds = assignments.map((a) => a._id);
    const submissions = await Submission.find({
        assignmentId: { $in: assignmentIds },
        studentId,
    }).lean();
    const byAssignment = {};
    submissions.forEach((s) => { byAssignment[s.assignmentId.toString()] = s; });
    const list = assignments.map((a) => ({
        ...a,
        submission: byAssignment[a._id.toString()] || null,
    }));
    return list;
};

export const getSubmissionById = async (assignmentId, submissionId, classId, role, userId) => {
    await getAssignmentById(assignmentId, classId);
    const submission = await Submission.findOne({
        _id: submissionId,
        assignmentId,
    })
        .populate('studentId', 'fullName email')
        .populate('gradedBy', 'fullName')
        .lean();
    if (!submission) throw { status: 404, message: 'Submission not found' };
    if (role === 'student' && submission.studentId._id.toString() !== userId.toString()) {
        throw { status: 403, message: 'Forbidden' };
    }
    return submission;
};

export const createSubmission = async (assignmentId, classId, studentId, body) => {
    const assignment = await getAssignmentById(assignmentId, classId);
    const enrolled = await Enrollment.findOne({ classId, studentId, status: ENROLL_STATUS.ACTIVE });
    if (!enrolled) throw { status: 403, message: 'Not enrolled in this class' };
    const existing = await Submission.findOne({ assignmentId, studentId });
    if (existing) throw { status: 400, message: 'Already submitted' };
    const dueDate = assignment.dueDate;
    if (dueDate && new Date() > dueDate && !assignment.allowLate) {
        throw { status: 400, message: 'Submission deadline passed' };
    }
    const submission = await Submission.create({
        assignmentId,
        studentId,
        content: body.content || '',
        fileUrls: body.fileUrls || [],
    });
    await submission.populate('studentId', 'fullName email');
    return submission;
};

export const updateSubmissionGrade = async (assignmentId, submissionId, classId, body, gradedBy) => {
    const assignment = await getAssignmentById(assignmentId, classId);
    let score = body.score;
    const rubricScores = body.rubricScores;
    if (Array.isArray(rubricScores) && rubricScores.length > 0) {
        score = rubricScores.reduce((s, n) => s + (Number(n) || 0), 0);
    }
    const update = { feedback: body.feedback ?? '', gradedAt: new Date(), gradedBy };
    if (score != null) update.score = score;
    if (Array.isArray(rubricScores)) update.rubricScores = rubricScores;
    const submission = await Submission.findOneAndUpdate(
        { _id: submissionId, assignmentId },
        update,
        { new: true }
    )
        .populate('studentId', 'fullName email')
        .populate('gradedBy', 'fullName');
    if (!submission) throw { status: 404, message: 'Submission not found' };
    const assignmentTitle = assignment?.title || submission.assignmentId?.title;
    await notificationService.createForUsers([submission.studentId._id], {
        title: `Bài tập "${assignmentTitle || 'Bài tập'}" đã được chấm điểm`,
        body: body.feedback ? `Điểm: ${score}. Nhận xét: ${body.feedback}` : `Điểm: ${score}`,
        type: 'grade',
        link: '/student/assignments',
    });
    return submission;
};
