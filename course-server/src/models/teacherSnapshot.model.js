import mongoose from 'mongoose'

const teacherSnapshotSchema = new mongoose.Schema(
    {
        teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        month: { type: String, required: true }, // "2026-02"
        totalClasses: Number,
        totalStudents: Number,
        generatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

teacherSnapshotSchema.index({ teacherId: 1, month: 1 }, { unique: true });

export const TeacherSnapshot = mongoose.model(
    "TeacherSnapshot",
    teacherSnapshotSchema
);
