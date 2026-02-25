import * as profileService from '../../services/profile.service.js';

export const getMe = async (req, res) => {
    const user = await profileService.getProfile(req.user.id);
    return res.status(200).json(user);
};

export const updateMe = async (req, res) => {
    const user = await profileService.updateProfile(req.user.id, req.body);
    return res.status(200).json(user);
};

export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await profileService.changePassword(req.user.id, currentPassword, newPassword);
    return res.status(200).json({ message: 'Password changed successfully' });
};

export const getMyClasses = async (req, res) => {
    const result = await profileService.getMyClasses(req.user.id, req.user.role, req.pagination);
    return res.status(200).json(result);
};

export const getMyPayments = async (req, res) => {
    const result = await profileService.getMyPayments(req.user.id, req.pagination);
    return res.status(200).json(result);
};

export const getMyResults = async (req, res) => {
    const result = await profileService.getMyResults(req.user.id, req.pagination);
    return res.status(200).json(result);
};

export const getMyJournals = async (req, res) => {
    const result = await profileService.getMyJournals(req.user.id, req.user.role, req.pagination);
    return res.status(200).json(result);
};
