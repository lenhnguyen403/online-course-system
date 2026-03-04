import mongoose from 'mongoose';
import { softDeletePlugin } from '../utils/basePlugin.js';

const rubricItemSchema = new mongoose.Schema({ name: String, maxScore: Number }, { _id: false });

const assignmentSchema = new mongoose.Schema(
    {
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        dueDate: { type: Date },
        maxScore: { type: Number, default: 10 },
        allowLate: { type: Boolean, default: false },
        rubric: [rubricItemSchema],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

assignmentSchema.index({ classId: 1 });
assignmentSchema.plugin(softDeletePlugin);

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
