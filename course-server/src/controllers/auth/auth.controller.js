import { 
    login as loginService, 
    refreshTokenService, 
    logout as logoutService, 
    forgotPassword as forgotPasswordService, 
    resetPassword as resetPasswordService 
} from '../../services/auth.service.js';

export const login = async (req, res) => {
    const result = await loginService(req.body);
    return res.status(200).json(result);
};

export const logout = async (req, res) => {
    const token = req.body?.refreshToken || req.headers['x-refresh-token'];
    const result = await logoutService(token);
    return res.status(200).json(result);
};

export const refreshToken = async (req, res) => {
    const token = req.body?.refreshToken || req.headers['x-refresh-token'];
    const result = await refreshTokenService(token);
    return res.status(200).json(result);
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const result = await forgotPasswordService(email);
    return res.status(200).json(result);
};

export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    await resetPasswordService(token, newPassword);
    return res.status(200).json({ message: 'Password reset successfully' });
};
