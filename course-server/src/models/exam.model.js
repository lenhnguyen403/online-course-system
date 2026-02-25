import mongoose from 'mongoose'
import { softDeletePlugin } from '../utils/basePlugin.js'
import { EXAM_TYPE } from '../constants/ExamType.js'

const examSchema = new mongoose.Schema(
    {
        classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
        title: { type: String, required: true },
        examType: {
            type: String,
            enum: [
                EXAM_TYPE.MIDTERM, 
                EXAM_TYPE.FINAL, 
                EXAM_TYPE.QUIZ
            ],
            required: true,
        },
        examDate: Date,
    },
    { timestamps: true }
);

examSchema.index({ classId: 1 });
examSchema.plugin(softDeletePlugin)

export const Exam = mongoose.model("Exam", examSchema);
