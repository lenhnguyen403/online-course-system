import * as journalService from '../../services/journal.service.js';

export const getClassJournals = async (req, res) => {
    const result = await journalService.getClassJournals(req.params.classId, req.pagination);
    return res.status(200).json(result);
};

export const createClassJournal = async (req, res) => {
    const journal = await journalService.createClassJournal(req.params.classId, req.user.id, req.body);
    return res.status(201).json(journal);
};

export const getClassJournalById = async (req, res) => {
    const journal = await journalService.getClassJournalById(req.params.classId, req.params.journalId);
    return res.status(200).json(journal);
};

export const deleteClassJournal = async (req, res) => {
    const result = await journalService.deleteClassJournal(req.params.classId, req.params.journalId);
    return res.status(200).json(result);
};

export const getStudentJournals = async (req, res) => {
    const result = await journalService.getStudentJournals(req.params.studentId, req.pagination);
    return res.status(200).json(result);
};

export const createStudentJournal = async (req, res) => {
    const journal = await journalService.createStudentJournal(req.params.studentId, req.user.id, req.body);
    return res.status(201).json(journal);
};

export const getStudentJournalById = async (req, res) => {
    const journal = await journalService.getStudentJournalById(req.params.studentId, req.params.journalId);
    return res.status(200).json(journal);
};

export const deleteStudentJournal = async (req, res) => {
    const result = await journalService.deleteStudentJournal(req.params.studentId, req.params.journalId);
    return res.status(200).json(result);
};
