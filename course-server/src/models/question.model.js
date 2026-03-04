import mongoose from 'mongoose';
import { softDeletePlugin } from '../utils/basePlugin.js';
import { QUESTION_TYPE } from '../constants/QuestionType.js';

const optionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
}, { _id: false });

const questionSchema = new mongoose.Schema(
    {
        examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
        order: { type: Number, required: true, default: 0 },
        type: {
            type: String,
            enum: Object.values(QUESTION_TYPE),
            required: true,
        },
        questionText: { type: String, required: true },
        options: [optionSchema],
        maxScore: { type: Number, default: 1 },
    },
    { timestamps: true }
);

questionSchema.index({ examId: 1, order: 1 });
questionSchema.plugin(softDeletePlugin);

const Question = mongoose.model('Question', questionSchema);
export default Question;
