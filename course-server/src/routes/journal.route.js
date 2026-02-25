import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authMiddleware } from '../middlewares/role.middleware.js';
import { paginationMiddleware } from '../middlewares/pagination.middleware.js';
import {
    getClassJournals,
    createClassJournal,
    getClassJournalById,
    deleteClassJournal,
    getStudentJournals,
    createStudentJournal,
    getStudentJournalById,
    deleteStudentJournal,
} from '../controllers/journal/journal.controller.js';

const journalRouter = express.Router();

journalRouter.use(verifyToken);
journalRouter.use(paginationMiddleware);

journalRouter.get('/classes/:classId/journals', getClassJournals);
journalRouter.post('/classes/:classId/journals', authMiddleware('admin', 'staff', 'teacher'), createClassJournal);
journalRouter.get('/classes/:classId/journals/:journalId', getClassJournalById);
journalRouter.delete('/classes/:classId/journals/:journalId', authMiddleware('admin', 'staff', 'teacher'), deleteClassJournal);

journalRouter.get('/students/:studentId/journals', getStudentJournals);
journalRouter.post('/students/:studentId/journals', authMiddleware('admin', 'staff', 'teacher'), createStudentJournal);
journalRouter.get('/students/:studentId/journals/:journalId', getStudentJournalById);
journalRouter.delete('/students/:studentId/journals/:journalId', authMiddleware('admin', 'staff', 'teacher'), deleteStudentJournal);

export default journalRouter;
