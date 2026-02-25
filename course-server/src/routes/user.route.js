import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { authMiddleware } from '../middlewares/role.middleware.js';
import { paginationMiddleware } from '../middlewares/pagination.middleware.js';
import {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    updateStatus,
    deactivateUser,
    sendCredentials,
} from '../controllers/admin/admin.controller.js';

const userRouter = express.Router();

userRouter.use(verifyToken);
userRouter.use(authMiddleware('admin', 'staff'));
userRouter.use(paginationMiddleware);

userRouter.get('/', getUsers);
userRouter.post('/', createUser);
userRouter.get('/:id', getUserById);
userRouter.put('/:id', updateUser);
userRouter.patch('/:id/status', updateStatus);
userRouter.patch('/:id/deactivate', deactivateUser);
userRouter.post('/:id/send-credentials', sendCredentials);

export default userRouter;