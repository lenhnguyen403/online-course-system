import mongoose from 'mongoose';
import { softDeletePlugin } from '../utils/basePlugin.js';

const moduleSchema = new mongoose.Schema(
    {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
        order: { type: Number, required: true, default: 0 },
        title: { type: String, required: true },
        description: { type: String, default: '' },
    },
    { timestamps: true }
);

moduleSchema.index({ courseId: 1, order: 1 });
moduleSchema.plugin(softDeletePlugin);

const Module = mongoose.model('Module', moduleSchema);
export default Module;
