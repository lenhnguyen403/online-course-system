import express from 'express';
import chalk from 'chalk';
import authRouter from './auth.route.js';
import profileRouter from './profile.route.js';
import userRouter from './user.route.js';
import subjectRouter from './subject.route.js';
import classRouter from './class.route.js';
import journalRouter from './journal.route.js';
import examRouter from './exam.route.js';
import paymentRouter from './payment.route.js';
import reportRouter from './report.route.js';
import dashboardRouter from './dashboard.route.js';

const API_PREFIX = process.env.API_PREFIX || '/api/v1';

const router = (app) => {
    app.use(`${API_PREFIX}/auth`, authRouter);
    app.use(`${API_PREFIX}/me`, profileRouter);
    app.use(`${API_PREFIX}/users`, userRouter);
    app.use(`${API_PREFIX}/subjects`, subjectRouter);
    app.use(`${API_PREFIX}/classes`, classRouter);
    app.use(`${API_PREFIX}/journals`, journalRouter);
    app.use(`${API_PREFIX}/exams`, examRouter);
    app.use(`${API_PREFIX}/payments`, paymentRouter);
    app.use(`${API_PREFIX}/reports`, reportRouter);
    app.use(`${API_PREFIX}/dashboard`, dashboardRouter);

    console.log(chalk.magentaBright.bold(`App is running on API prefix: ${API_PREFIX}`));

}

export default router;

