import * as assignmentService from '../../services/assignment.service.js';

export const getAssignmentsByClass = async (req, res) => {
    const { classId } = req.params;
    const mySubmissions = req.query.mySubmissions === '1' || req.query.mySubmissions === 'true';
    if (req.user?.role === 'student' && mySubmissions) {
        const list = await assignmentService.getMySubmissionsByClass(req.user.id, classId);
        return res.status(200).json(list);
    }
    const data = await assignmentService.getAssignmentsByClass(classId);
    return res.status(200).json(data);
};

export const getAssignmentById = async (req, res) => {
    const data = await assignmentService.getAssignmentById(req.params.assignmentId, req.params.classId);
    return res.status(200).json(data);
};

export const createAssignment = async (req, res) => {
    const assignment = await assignmentService.createAssignment(
        req.params.classId,
        req.body,
        req.user?.id
    );
    return res.status(201).json(assignment);
};

export const updateAssignment = async (req, res) => {
    const assignment = await assignmentService.updateAssignment(
        req.params.assignmentId,
        req.params.classId,
        req.body
    );
    return res.status(200).json(assignment);
};

export const deleteAssignment = async (req, res) => {
    await assignmentService.deleteAssignment(
        req.params.assignmentId,
        req.params.classId,
        req.user?.id
    );
    return res.status(200).json({ message: 'Assignment deactivated' });
};

export const getSubmissionsByAssignment = async (req, res) => {
    const result = await assignmentService.getSubmissionsByAssignment(
        req.params.assignmentId,
        req.params.classId,
        req.pagination
    );
    return res.status(200).json(result);
};

export const getSubmissionById = async (req, res) => {
    const data = await assignmentService.getSubmissionById(
        req.params.assignmentId,
        req.params.submissionId,
        req.params.classId,
        req.user?.role,
        req.user?.id
    );
    return res.status(200).json(data);
};

export const createSubmission = async (req, res) => {
    const submission = await assignmentService.createSubmission(
        req.params.assignmentId,
        req.params.classId,
        req.user.id,
        req.body
    );
    return res.status(201).json(submission);
};

export const uploadSubmissionFile = async (req, res) => {
    if (!req.file || !req.file.filename) return res.status(400).json({ message: 'No file uploaded' });
    const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
    const url = `${baseUrl}/uploads/submissions/${req.file.filename}`;
    return res.status(200).json({ url });
};

export const updateSubmissionGrade = async (req, res) => {
    const submission = await assignmentService.updateSubmissionGrade(
        req.params.assignmentId,
        req.params.submissionId,
        req.params.classId,
        req.body,
        req.user?.id
    );
    return res.status(200).json(submission);
};
