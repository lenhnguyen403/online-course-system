import { passwordEncoded, passwordCompare } from '../../middlewares/hash_password.middleware.js'
import { login as loginService } from '../../services/auth.service.js';

// POST /auth/login
const login = async (req, res) => {
    const result = await loginService(req.body)
    return res.json(result)
};

// POST /auth/logout
const logout = async (req, res) => {

};

// POST /auth/refresh-token
const refreshToken = async (req, res) => {

}

// POST /auth/forgot-password
const forgotPassword = async (req, res) => {

}

// POST /auth/reset-password
const resetPassword = async (req, res) => {

}

export {
    login,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword
};