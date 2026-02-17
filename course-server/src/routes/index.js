import express from 'express';
import authRouter from './auth.route.js';
import userRouter from './user.route.js';
import courseRouter from './course.route.js';
import { BASE_URL } from './base.route.js'

const router = (app) => {
    app.use(`${BASE_URL}/auth`, authRouter);
    app.use(`${BASE_URL}/users`, userRouter);
    app.use(`${BASE_URL}/courses`, courseRouter);
}

export default router;

