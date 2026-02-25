import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authMiddleware } from '../middlewares/role.middleware.js';
import { paginationMiddleware } from '../middlewares/pagination.middleware.js';
import {
    getStudentPayments,
    createPayment,
    updatePayment,
    updatePaymentStatus,
    getNextPayment,
    sendReminder,
} from '../controllers/payment/payment.controller.js';

const paymentRouter = express.Router();

paymentRouter.use(verifyToken);
paymentRouter.use(paginationMiddleware);

paymentRouter.get('/students/:studentId/payments', getStudentPayments);
paymentRouter.post('/students/:studentId/payments', authMiddleware('admin', 'staff'), createPayment);
paymentRouter.put('/payments/:paymentId', authMiddleware('admin', 'staff'), updatePayment);
paymentRouter.patch('/payments/:paymentId/status', authMiddleware('admin', 'staff'), updatePaymentStatus);
paymentRouter.get('/students/:studentId/next-payment', getNextPayment);
paymentRouter.post('/payments/:paymentId/send-reminder', authMiddleware('admin', 'staff'), sendReminder);

export default paymentRouter;