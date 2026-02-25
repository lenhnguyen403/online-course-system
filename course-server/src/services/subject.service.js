import Subject from '../models/subject.model.js';

export const getSubjects = async (pagination, filter = {}) => {
    const [data, total] = await Promise.all([
        Subject.find(filter)
            .skip(pagination.offset)
            .limit(pagination.limit)
            .sort({ createdAt: -1 })
            .lean(),
        Subject.countDocuments(filter),
    ]);
    return { data, total, ...pagination };
};

export const createSubject = async (body) => {
    const subject = await Subject.create(body);
    return subject;
};

export const getSubjectById = async (id) => {
    const subject = await Subject.findById(id);
    if (!subject) throw { status: 404, message: 'Subject not found' };
    return subject;
};

export const updateSubject = async (id, body) => {
    const allowed = ['subjectCode', 'subjectName', 'description'];
    const update = {};
    allowed.forEach((k) => { if (body[k] !== undefined) update[k] = body[k]; });
    const subject = await Subject.findByIdAndUpdate(id, update, { new: true });
    if (!subject) throw { status: 404, message: 'Subject not found' };
    return subject;
};

export const deactivateSubject = async (id, userId) => {
    const subject = await Subject.findById(id);
    if (!subject) throw { status: 404, message: 'Subject not found' };
    await subject.softDelete(userId);
    return subject;
};
