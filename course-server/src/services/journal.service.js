import { Journal } from '../models/journal.model.js';

export const getClassJournals = async (classId, pagination) => {
    const filter = { classId, type: 'CLASS' };
    const [data, total] = await Promise.all([
        Journal.find(filter)
            .populate('teacherId', 'fullName email')
            .skip(pagination.offset)
            .limit(pagination.limit)
            .sort({ createdAt: -1 })
            .lean(),
        Journal.countDocuments(filter),
    ]);
    return { data, total, ...pagination };
};

export const createClassJournal = async (classId, teacherId, body) => {
    const journal = await Journal.create({
        type: 'CLASS',
        classId,
        teacherId,
        content: body.content,
    });
    await journal.populate('teacherId', 'fullName email');
    return journal;
};

export const getClassJournalById = async (classId, journalId) => {
    const journal = await Journal.findOne({ _id: journalId, classId, type: 'CLASS' })
        .populate('teacherId', 'fullName email');
    if (!journal) throw { status: 404, message: 'Journal not found' };
    return journal;
};

export const deleteClassJournal = async (classId, journalId) => {
    const result = await Journal.deleteOne({ _id: journalId, classId, type: 'CLASS' });
    if (result.deletedCount === 0) throw { status: 404, message: 'Journal not found' };
    return { message: 'Deleted' };
};

export const getStudentJournals = async (studentId, pagination) => {
    const filter = { studentId, type: 'STUDENT' };
    const [data, total] = await Promise.all([
        Journal.find(filter)
            .populate('teacherId', 'fullName email')
            .populate('classId')
            .skip(pagination.offset)
            .limit(pagination.limit)
            .sort({ createdAt: -1 })
            .lean(),
        Journal.countDocuments(filter),
    ]);
    return { data, total, ...pagination };
};

export const createStudentJournal = async (studentId, teacherId, body) => {
    const journal = await Journal.create({
        type: 'STUDENT',
        studentId,
        teacherId,
        content: body.content,
        classId: body.classId,
    });
    await journal.populate('teacherId', 'fullName email');
    return journal;
};

export const getStudentJournalById = async (studentId, journalId) => {
    const journal = await Journal.findOne({ _id: journalId, studentId, type: 'STUDENT' })
        .populate('teacherId', 'fullName email');
    if (!journal) throw { status: 404, message: 'Journal not found' };
    return journal;
};

export const deleteStudentJournal = async (studentId, journalId) => {
    const result = await Journal.deleteOne({ _id: journalId, studentId, type: 'STUDENT' });
    if (result.deletedCount === 0) throw { status: 404, message: 'Journal not found' };
    return { message: 'Deleted' };
};
