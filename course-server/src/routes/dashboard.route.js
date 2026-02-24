import express from 'express';

const dashboardRouter = express.Router();

// Audit Logs
dashboardRouter.get('/audit-logs');

// Dashboard Summaries
dashboardRouter.get('/teacher/');
dashboardRouter.get('/student/');
dashboardRouter.get('/class/');

export default dashboardRouter