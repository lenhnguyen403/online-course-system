import express from 'express';
import authRouter from './auth.route.js';
import userRouter from './user.route.js';
import courseRouter from './course.route.js';

const router = (app) => {
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/courses', courseRouter);
}

export default router;

