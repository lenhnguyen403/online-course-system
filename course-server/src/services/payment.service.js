import { Payment } from '../models/payment.model.js';
import { PAYMENT_STATUS } from '../constants/PaymentStatus.js';

export const getStudentPayments = async (studentId, pagination) => {
    const [data, total] = await Promise.all([
        Payment.find({ studentId })
            .populate('classId')
            .skip(pagination.offset)
            .limit(pagination.limit)
            .sort({ dueDate: -1 })
            .lean(),
        Payment.countDocuments({ studentId }),
    ]);
    return { data, total, ...pagination };
};

export const createPayment = async (studentId, body) => {
    const payment = await Payment.create({ ...body, studentId });
    await payment.populate('classId');
    return payment;
};

export const updatePayment = async (paymentId, body) => {
    const allowed = ['amount', 'dueDate', 'paidDate'];
    const update = {};
    allowed.forEach((k) => { if (body[k] !== undefined) update[k] = body[k]; });
    const payment = await Payment.findByIdAndUpdate(paymentId, update, { new: true }).populate('classId');
    if (!payment) throw { status: 404, message: 'Payment not found' };
    return payment;
};

export const updatePaymentStatus = async (paymentId, status) => {
    if (!Object.values(PAYMENT_STATUS).includes(status))
        throw { status: 400, message: 'Invalid status' };
    const payment = await Payment.findByIdAndUpdate(paymentId, { status }, { new: true });
    if (!payment) throw { status: 404, message: 'Payment not found' };
    return payment;
};

export const getNextPayment = async (studentId) => {
    const payment = await Payment.findOne({
        studentId,
        status: { $in: [PAYMENT_STATUS.UNPAID, PAYMENT_STATUS.OVERDUE, PAYMENT_STATUS.PENDING] },
    })
        .sort({ dueDate: 1 })
        .populate('classId')
        .lean();
    return payment || null;
};

export const sendReminder = async (paymentId) => {
    const payment = await Payment.findById(paymentId).populate('studentId', 'email fullName');
    if (!payment) throw { status: 404, message: 'Payment not found' };
    // TODO: send email reminder
    return { message: 'Reminder sent' };
};
