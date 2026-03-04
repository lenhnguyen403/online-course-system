import mongoose from 'mongoose';
import { softDeletePlugin } from '../utils/basePlugin.js';
import { LESSON_TYPE } from '../constants/LessonType.js';

const lessonSchema = new mongoose.Schema(
    {
        moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
        order: { type: Number, required: true, default: 0 },
        title: { type: String, required: true },
        lessonType: {
            type: String,
            enum: Object.values(LESSON_TYPE),
            required: true,
        },
        content: { type: String, default: '' },
        resourceUrl: { type: String, default: '' },
        durationMinutes: { type: Number, default: 0 },
        isFree: { type: Boolean, default: false },
    },
    { timestamps: true }
);

lessonSchema.index({ moduleId: 1, order: 1 });
lessonSchema.plugin(softDeletePlugin);

const Lesson = mongoose.model('Lesson', lessonSchema);
export default Lesson;
