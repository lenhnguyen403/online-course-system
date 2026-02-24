import express from 'express';

const paymentRouter = express.Router();

paymentRouter.get('/students/:studentId/payments');
paymentRouter.post('/students/:studentId/payments')
paymentRouter.put('/payments/:paymentId');
paymentRouter.patch('/payments/:paymentId/status');
paymentRouter.get('/students/:studentId/next-payment');
paymentRouter.post('/payments/:paymentId/send-reminder');
export default paymentRouter