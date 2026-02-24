import express from 'express';
import {
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword
} from '../controllers/auth/auth.controller.js';

const authRouter = express.Router();

authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/refresh-token', refreshToken);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

export default authRouter;