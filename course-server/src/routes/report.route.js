import express from 'express';

const reportRouter = express.Router();

reportRouter.get('/teacher-student-count');
reportRouter.get('/class-performance/:classId');
reportRouter.get('/student-progress/:studentId');
reportRouter.get('/financial');
reportRouter.get('/class-score-chart/:classId');
reportRouter.get('/teacher-monthly/:month');

export default reportRouter