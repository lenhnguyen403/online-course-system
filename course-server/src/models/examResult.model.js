import mongoose from 'mongoose'

const examResultSchema = new mongoose.Schema(
    {
        examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        theoryScore: { type: Number, required: true, min: 0, max: 10 },
        practiceScore: { type: Number, required: true, min: 0, max: 10 },
        averageScore: { type: Number },
        gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

examResultSchema.pre("save", function (next) {
    this.averageScore = (this.theoryScore + this.practiceScore) / 2;
    next();
});

examResultSchema.index({ examId: 1, studentId: 1 }, { unique: true });
examResultSchema.index({ studentId: 1 });

export const ExamResult = mongoose.model("ExamResult", examResultSchema);
