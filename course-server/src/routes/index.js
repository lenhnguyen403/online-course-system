import express from 'express';
import authRouter from './auth.route.js';
import profileRouter from './profile.route.js';
import userRouter from './user.route.js';
import subjectRouter from './subject.route.js';
import courseRouter from './course.route.js';
import classRouter from './class.route.js';
import journalRouter from './journal.route.js';
import examRouter from './exam.route.js';
import paymentRouter from './payment.route.js';
import reportRouter from './report.route.js';
import dashboardRouter from './dashboard.route.js';

const router = (app) => {
    app.use(`/auth`, authRouter);
    app.use(`/me`, profileRouter);
    app.use(`/users`, userRouter);
    app.use(`/subjects`, subjectRouter);
    app.use(`/courses`, courseRouter);
    app.use(`/classes`, classRouter);
    app.use(`/journals`, journalRouter);
    app.use(`/exams`, examRouter);
    app.use(`/payments`, paymentRouter);
    app.use(`/reports`, reportRouter);
    app.use(`/dashboard`, dashboardRouter);
}

export default router;

