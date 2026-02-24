import express from 'express';

const classRouter = express.Router();

classRouter.get('/');
classRouter.post('/');
classRouter.get('/:id')
classRouter.put('/:id');
classRouter.patch('/:id/deactivate');

// Student Enrollment
classRouter.get('/:classId/students');
classRouter.post('/:classId/students');
classRouter.get('/:classId/students/:studentId');
classRouter.patch('/:classId/students/:studentId');
classRouter.patch('/:classId/students/:studentId/status');
classRouter.delete('/:classId/students/:studentId');

// Assign Teacher
classRouter.get('/:classId/teachers');
classRouter.post('/:classId/teachers');
classRouter.delete('/:classId/teachers/:teacherId');

export default classRouter