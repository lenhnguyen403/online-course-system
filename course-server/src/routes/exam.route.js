import express from 'express';

const examRouter = express.Router();

examRouter.get('/classes/:classId/exams');
examRouter.post('/classes/:classId/exams');
examRouter.get('/exams/:examId');
examRouter.put('/exams/:examId');
examRouter.delete('/exams/:examId');

// Exam Results
examRouter.get('/exams/:examId/results');
examRouter.post('/exams/:examId/results');
examRouter.post('/exams/:examId/results/bulk');
examRouter.put('/exams/:examId/results/:studentId');
examRouter.get('/students/:studentId/results');
examRouter.get('/students/:studentId/average-score');
examRouter.get('/classes/:classId/average-score');

export default examRouter