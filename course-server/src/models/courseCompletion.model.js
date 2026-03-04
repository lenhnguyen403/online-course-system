import mongoose from 'mongoose';

const courseCompletionSchema = new mongoose.Schema(
    {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
        completedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

courseCompletionSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
courseCompletionSchema.index({ studentId: 1 });

const CourseCompletion = mongoose.model('CourseCompletion', courseCompletionSchema);
export default CourseCompletion;
