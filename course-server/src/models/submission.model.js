import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
    {
        assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, default: '' },
        fileUrls: [{ type: String }],
score: { type: Number, min: 0 },
    rubricScores: [Number],
    feedback: { type: String, default: '' },
        submittedAt: { type: Date, default: Date.now },
        gradedAt: { type: Date },
        gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

submissionSchema.index({ assignmentId: 1, studentId: 1 }, { unique: true });
submissionSchema.index({ studentId: 1 });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
