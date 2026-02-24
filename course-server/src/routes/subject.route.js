import express from 'express';

const subjectRouter = express.Router();

subjectRouter.get('/');
subjectRouter.post('/');
subjectRouter.get('/:id')
subjectRouter.put('/:id');
subjectRouter.patch('/:id/deactivate');

export default subjectRouter