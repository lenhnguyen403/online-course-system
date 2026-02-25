import mongoose from 'mongoose'

const journalSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["CLASS", "STUDENT"],
            required: true,
        },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

journalSchema.index({ classId: 1 });
journalSchema.index({ studentId: 1 });

export const Journal = mongoose.model("Journal", journalSchema);
