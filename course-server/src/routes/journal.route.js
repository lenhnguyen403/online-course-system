import express from 'express';

const journalRouter = express.Router();

// Class Journals
journalRouter.get('/classes/:classId/journals');
journalRouter.post('/classes/:classId/journals');
journalRouter.get('/classes/:classId/journals/:journalId');
journalRouter.delete('/classes/:classId/journals/:journalId');

// Student Journals
journalRouter.get('/students/:studentId/journals');
journalRouter.post('/students/:studentId/journals');
journalRouter.get('/students/:studentId/journals/:journalId');
journalRouter.delete('/students/:studentId/journals/:journalId');

export default journalRouter