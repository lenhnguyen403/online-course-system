import { passwordCompare } from '../middlewares/hash_password.middleware.js'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

export const login = async ({ email, password }) => {
    const user = await User.findOne({ email, isDeleted: false })

    if (!user) throw {
        status: 400,
        message: 'Invalid credentials',
    }

    const isMatch = passwordCompare(password, user.password)
    if (!isMatch) throw {
        status: 400,
        message: 'Invalid credentials',
    }

    const accessToken = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )

    return { accessToken }
}

export const refreshToken = async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
    return jwt.sign(
        {
            id: decoded.id,
            role: decoded.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )
}