import * as dashboardService from '../../services/dashboard.service.js';
import * as learningReportService from '../../services/learningReport.service.js';

export const getAdminDashboard = async (req, res) => {
    const data = await dashboardService.getAdminDashboard();
    return res.status(200).json(data);
};

export const getTeacherDashboard = async (req, res) => {
    const data = await dashboardService.getTeacherDashboard(req.user.id);
    return res.status(200).json(data);
};

export const getTeacherPendingSubmissions = async (req, res) => {
    const data = await dashboardService.getTeacherPendingSubmissions(req.user.id, req.pagination);
    return res.status(200).json(data);
};

export const getStudentDashboard = async (req, res) => {
    const data = await dashboardService.getStudentDashboard(req.user.id);
    return res.status(200).json(data);
};

export const getClassDashboard = async (req, res) => {
    const data = await dashboardService.getClassDashboard();
    return res.status(200).json(data);
};

export const getClassScoreChart = async (req, res) => {
    const data = await dashboardService.getClassScoreChart(req.params.classId);
    return res.status(200).json(data);
};

export const generateTeacherSnapshot = async (req, res) => {
    const data = await dashboardService.generateTeacherSnapshot();
    return res.status(200).json(data);
};

export const getAuditLogs = async (req, res) => {
    const data = await dashboardService.getAuditLogs(req.pagination);
    return res.status(200).json(data);
};

export const getClassLearningReport = async (req, res) => {
    const data = await learningReportService.getClassLearningReport(
        req.params.classId,
        req.user.role,
        req.user.id
    );
    return res.status(200).json(data);
};
