import * as reportService from '../../services/report.service.js';

export const getTeacherStudentCount = async (req, res) => {
    const data = await reportService.getTeacherStudentCount();
    return res.status(200).json(data);
};

export const getClassPerformance = async (req, res) => {
    const data = await reportService.getClassPerformance(req.params.classId);
    return res.status(200).json(data);
};

export const getStudentProgress = async (req, res) => {
    const data = await reportService.getStudentProgress(req.params.studentId);
    return res.status(200).json(data);
};

export const getFinancial = async (req, res) => {
    const data = await reportService.getFinancialReport();
    return res.status(200).json(data);
};

export const getClassScoreChart = async (req, res) => {
    const data = await reportService.getClassScoreChart(req.params.classId);
    return res.status(200).json(data);
};

export const getTeacherMonthly = async (req, res) => {
    const data = await reportService.getTeacherMonthly(req.params.month);
    return res.status(200).json(data);
};
