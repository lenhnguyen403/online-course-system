import * as courseCompletionService from '../../services/courseCompletion.service.js';

export const getMyCompletions = async (req, res) => {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Only for students' });
    const data = await courseCompletionService.getMyCompletions(req.user.id);
    return res.status(200).json(data);
};

export const getCertificate = async (req, res) => {
    if (req.user.role !== 'student') return res.status(403).json({ message: 'Only for students' });
    const data = await courseCompletionService.getOrIssueCertificate(req.user.id, req.params.courseId);
    return res.status(200).json(data);
};
