import express from 'express'
import {
    getUsers,
    createUser,
    getUserById,
    updateUser,
    updateStatus,
    deactivateUser,
    sendCredentials
} from '../controllers/admin/admin.controller.js'

const userRouter = express.Router()

userRouter.get('/', getUsers)
userRouter.post('/', createUser)
userRouter.get('/:id', getUserById)
userRouter.put('/:id', updateUser)
userRouter.patch('/:id/status', getUserById)
userRouter.patch('/:id/deactivate', getUserById)
userRouter.post('/:id/send-credentials', sendCredentials)

export default userRouter