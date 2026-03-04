import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        body: { type: String, default: '' },
        type: { type: String, default: 'info' },
        link: { type: String, default: '' },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
