import * as notificationService from '../../services/notification.service.js';

export const getMyNotifications = async (req, res) => {
    const result = await notificationService.getMyNotifications(req.user.id, req.pagination);
    return res.status(200).json(result);
};

export const markAsRead = async (req, res) => {
    const notif = await notificationService.markAsRead(req.params.id, req.user.id);
    return res.status(200).json(notif);
};

export const markAllAsRead = async (req, res) => {
    const result = await notificationService.markAllAsRead(req.user.id);
    return res.status(200).json(result);
};
