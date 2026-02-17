import mongoose from 'mongoose'

const refreshTokenSchema = new mongoose.Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        token: { type: String, required: true },
        expiredAt: { type: Date, required: true },
    },
    { timestamps: true }
);

refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
