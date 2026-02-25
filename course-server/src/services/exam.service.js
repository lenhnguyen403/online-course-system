import mongoose from 'mongoose';
import { Exam } from '../models/exam.model.js';
import { ExamResult } from '../models/examResult.model.js';

export const getExamsByClass = async (classId) => {
    const exams = await Exam.find({ classId }).sort({ examDate: 1 }).lean();
    return exams;
};

export const createExam = async (classId, body) => {
    const exam = await Exam.create({ ...body, classId });
    return exam;
};

export const getExamById = async (examId) => {
    const exam = await Exam.findById(examId).populate('classId');
    if (!exam) throw { status: 404, message: 'Exam not found' };
    return exam;
};

export const updateExam = async (examId, body) => {
    const exam = await Exam.findByIdAndUpdate(examId, body, { new: true });
    if (!exam) throw { status: 404, message: 'Exam not found' };
    return exam;
};

export const deleteExam = async (examId) => {
    const result = await Exam.deleteOne({ _id: examId });
    if (result.deletedCount === 0) throw { status: 404, message: 'Exam not found' };
    return { message: 'Deleted' };
};

export const getExamResults = async (examId, pagination) => {
    const [data, total] = await Promise.all([
        ExamResult.find({ examId })
            .populate('studentId', 'fullName email')
            .skip(pagination.offset)
            .limit(pagination.limit)
            .lean(),
        ExamResult.countDocuments({ examId }),
    ]);
    return { data, total, ...pagination };
};

export const createExamResult = async (examId, body, gradedBy) => {
    const result = await ExamResult.create({ ...body, examId, gradedBy });
    await result.populate('studentId', 'fullName email');
    return result;
};

export const bulkCreateExamResults = async (examId, items, gradedBy) => {
    const docs = items.map((item) => ({ ...item, examId, gradedBy }));
    const results = await ExamResult.insertMany(docs);
    return results;
};

export const updateExamResult = async (examId, studentId, body) => {
    const result = await ExamResult.findOneAndUpdate(
        { examId, studentId },
        body,
        { new: true }
    ).populate('studentId', 'fullName email');
    if (!result) throw { status: 404, message: 'Result not found' };
    return result;
};

export const getStudentResults = async (studentId, pagination) => {
    const [data, total] = await Promise.all([
        ExamResult.find({ studentId })
            .populate({ path: 'examId', populate: 'classId' })
            .skip(pagination.offset)
            .limit(pagination.limit)
            .sort({ createdAt: -1 })
            .lean(),
        ExamResult.countDocuments({ studentId }),
    ]);
    return { data, total, ...pagination };
};

export const getStudentAverageScore = async (studentId) => {
    const agg = await ExamResult.aggregate([
        { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
        { $group: { _id: null, avg: { $avg: '$averageScore' } } },
    ]);
    return { averageScore: agg[0]?.avg ?? 0 };
};

export const getClassAverageScore = async (classId) => {
    const examIds = (await Exam.find({ classId }).select('_id').lean()).map((e) => e._id);
    const agg = await ExamResult.aggregate([
        { $match: { examId: { $in: examIds } } },
        { $group: { _id: null, avg: { $avg: '$averageScore' } } },
    ]);
    return { averageScore: agg[0]?.avg ?? 0 };
};
