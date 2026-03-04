import Notification from '../models/notification.model.js';

export const createForUsers = async (userIds, { title, body, type = 'info', link = '' }) => {
    if (!userIds?.length) return [];
    const docs = userIds.map((userId) => ({ userId, title, body, type, link }));
    const created = await Notification.insertMany(docs);
    return created;
};

export const getMyNotifications = async (userId, pagination) => {
    const [data, total, unreadCount] = await Promise.all([
        Notification.find({ userId })
            .sort({ createdAt: -1 })
            .skip(pagination.offset)
            .limit(pagination.limit)
            .lean(),
        Notification.countDocuments({ userId }),
        Notification.countDocuments({ userId, read: false }),
    ]);
    return { data, total, unreadCount, ...pagination };
};

export const markAsRead = async (notificationId, userId) => {
    const notif = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true },
        { new: true }
    );
    if (!notif) throw { status: 404, message: 'Notification not found' };
    return notif;
};

export const markAllAsRead = async (userId) => {
    await Notification.updateMany({ userId }, { read: true });
    return { message: 'All marked as read' };
};
