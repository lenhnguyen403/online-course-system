import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    optionIndex: { type: Number, required: true },
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema(
    {
        examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        answers: [answerSchema],
        score: { type: Number, default: 0 },
        maxScore: { type: Number, default: 0 },
        submittedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

quizAttemptSchema.index({ examId: 1, studentId: 1 });
quizAttemptSchema.index({ studentId: 1 });

const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema);
export default QuizAttempt;
