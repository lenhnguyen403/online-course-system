import mongoose from 'mongoose';
import { PROGRESS_STATUS } from '../constants/ProgressStatus.js';

const lessonProgressSchema = new mongoose.Schema(
    {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
        status: {
            type: String,
            enum: Object.values(PROGRESS_STATUS),
            default: PROGRESS_STATUS.NOT_STARTED,
        },
        completedAt: { type: Date, default: null },
        lastAccessedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

lessonProgressSchema.index({ studentId: 1, lessonId: 1 }, { unique: true });
lessonProgressSchema.index({ studentId: 1 });

const LessonProgress = mongoose.model('LessonProgress', lessonProgressSchema);
export default LessonProgress;
