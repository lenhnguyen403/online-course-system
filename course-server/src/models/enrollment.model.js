import mongoose from 'mongoose'
import { softDeletePlugin } from '../utils/basePlugin.js'
import { ENROLL_STATUS } from '../constants/EnrollStatus.js'

const enrollmentSchema = new mongoose.Schema(
    {
        classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: [
                ENROLL_STATUS.ACTIVE,
                ENROLL_STATUS.SUSPENDED,
                ENROLL_STATUS.TRANSFER_PENDING,
                ENROLL_STATUS.DROPPED
            ],
            default: ENROLL_STATUS.ACTIVE,
        },
        joinedAt: { type: Date, default: Date.now },
        leftAt: Date,
    },
    { timestamps: true }
)

// enrollmentSchema.index({ classId: 1 });
// enrollmentSchema.index({ studentId: 1 });
enrollmentSchema.index({ classId: 1, studentId: 1 }, { unique: true });
enrollmentSchema.plugin(softDeletePlugin)

const Enrollment = mongoose.model('Enrollment', enrollmentSchema)

export default Enrollment