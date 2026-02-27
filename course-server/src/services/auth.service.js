import { passwordCompare } from '../middlewares/hash_password.middleware.js';
import User from '../models/user.model.js';
import { RefreshToken } from '../models/refreshToken.model.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// console.log('SECRET:', process.env.JWT_SECRET);

// In-memory store for reset tokens (use Redis in production)
const resetTokens = new Map();

export const login = async ({ email, password }) => {
    const user = await User.findOne({
        email,
        $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } }
        ]
    });

    if (!user)
        throw { status: 400, message: 'Invalid credentials. User not found.' };

    const isMatch = await passwordCompare(password, user.password);
    if (!isMatch)
        throw { status: 400, message: 'Invalid credentials. Password does not match.' };

    const accessToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        JWT_REFRESH_SECRET,
        { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );

    const decoded = jwt.decode(refreshToken);
    await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiredAt: decoded ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        }
    };
};

export const refreshTokenService = async (token) => {
    if (!token)
        throw { status: 401, message: 'Refresh token is required' };

    const stored = await RefreshToken.findOne({ token });
    if (!stored || new Date() > stored.expiredAt)
        throw { status: 403, message: 'Invalid or expired refresh token' };

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    } catch {
        await RefreshToken.deleteOne({ token });
        throw { status: 403, message: 'Invalid or expired refresh token' };
    }

    const newAccessToken = jwt.sign(
        { id: decoded.id, email: decoded.email, role: decoded.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );

    return { accessToken: newAccessToken };
};

export const logout = async (token) => {
    if (token)
        await RefreshToken.deleteOne({ token });
    return { message: 'Logged out successfully' };
};

export const forgotPassword = async (email) => {
    const user = await User.findOne({ email, isDeleted: false });
    if (!user)
        return { message: 'If the email exists, a reset link has been sent' };

    const resetToken = jwt.sign(
        { id: user._id, purpose: 'reset-password' },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
    resetTokens.set(resetToken, { userId: user._id.toString(), exp: Date.now() + 3600000 });

    // TODO: Send email with reset link (e.g. /reset-password?token=...)
    return { message: 'If the email exists, a reset link has been sent' };
};

export const resetPassword = async (token, newPassword) => {
    const stored = resetTokens.get(token);
    if (!stored || Date.now() > stored.exp)
        throw { status: 400, message: 'Invalid or expired reset token' };

    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch {
        resetTokens.delete(token);
        throw { status: 400, message: 'Invalid or expired reset token' };
    }

    const { passwordEncoded } = await import('../middlewares/hash_password.middleware.js');
    const hashed = await passwordEncoded(newPassword);
    await User.updateOne({ _id: decoded.id }, { password: hashed });
    resetTokens.delete(token);
    return { message: 'Password reset successfully' };
};
