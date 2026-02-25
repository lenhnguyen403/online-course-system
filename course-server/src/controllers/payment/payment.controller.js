import * as paymentService from '../../services/payment.service.js';

export const getStudentPayments = async (req, res) => {
    const result = await paymentService.getStudentPayments(req.params.studentId, req.pagination);
    return res.status(200).json(result);
};

export const createPayment = async (req, res) => {
    const payment = await paymentService.createPayment(req.params.studentId, req.body);
    return res.status(201).json(payment);
};

export const updatePayment = async (req, res) => {
    const payment = await paymentService.updatePayment(req.params.paymentId, req.body);
    return res.status(200).json(payment);
};

export const updatePaymentStatus = async (req, res) => {
    const { status } = req.body;
    const payment = await paymentService.updatePaymentStatus(req.params.paymentId, status);
    return res.status(200).json(payment);
};

export const getNextPayment = async (req, res) => {
    const payment = await paymentService.getNextPayment(req.params.studentId);
    return res.status(200).json(payment);
};

export const sendReminder = async (req, res) => {
    const result = await paymentService.sendReminder(req.params.paymentId);
    return res.status(200).json(result);
};
