import mongoose from 'mongoose'
import { ATTENDANCE_STATUS } from '../constants/AttendanceStatus.js'

const attendanceRecordSchema = new mongoose.Schema(
    {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: [
                ATTENDANCE_STATUS.PRESENT,
                ATTENDANCE_STATUS.ABSENT,
                ATTENDANCE_STATUS.LAT
            ],
            required: true,
        },
    },
    { _id: false }
);

const attendanceSchema = new mongoose.Schema(
    {
        classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
        date: { type: Date, required: true },
        records: [attendanceRecordSchema],
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

attendanceSchema.index({ classId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
