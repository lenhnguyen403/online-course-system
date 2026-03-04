import mongoose from 'mongoose';
import { softDeletePlugin } from '../utils/basePlugin.js';

const announcementSchema = new mongoose.Schema(
    {
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
        title: { type: String, required: true },
        content: { type: String, default: '' },
        authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        pinned: { type: Boolean, default: false },
    },
    { timestamps: true }
);

announcementSchema.index({ classId: 1 });
announcementSchema.index({ classId: 1, pinned: -1, createdAt: -1 });
announcementSchema.plugin(softDeletePlugin);

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
