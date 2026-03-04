import mongoose from 'mongoose';

const resetTokenSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        token: { type: String, required: true, unique: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
);

resetTokenSchema.index({ token: 1 });
resetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL: delete when current time > expiresAt

const ResetToken = mongoose.model('ResetToken', resetTokenSchema);
export default ResetToken;
