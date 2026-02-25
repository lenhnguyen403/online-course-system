import mongoose from 'mongoose'
import { softDeletePlugin } from '../utils/basePlugin.js'
import { PAYMENT_STATUS } from '../constants/PaymentStatus.js';

const paymentSchema = new mongoose.Schema(
    {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
        amount: { type: Number, required: true },
        dueDate: { type: Date, required: true },
        paidDate: Date,
        status: {
            type: String,
            enum: [
                PAYMENT_STATUS.PENDING, 
                PAYMENT_STATUS.PAID, 
                PAYMENT_STATUS.UNPAID, 
                PAYMENT_STATUS.OVERDUE
            ],
            default: PAYMENT_STATUS.UNPAID,
        },
    },
    { timestamps: true }
);

paymentSchema.index({ studentId: 1 });
paymentSchema.index({ dueDate: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.plugin(softDeletePlugin)

export const Payment = mongoose.model("Payment", paymentSchema);
