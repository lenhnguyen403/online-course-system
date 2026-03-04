import * as announcementService from '../../services/announcement.service.js';

export const getAnnouncementsByClass = async (req, res) => {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const data = await announcementService.getAnnouncementsByClass(req.params.classId, limit);
    return res.status(200).json(data);
};

export const getAnnouncementById = async (req, res) => {
    const data = await announcementService.getAnnouncementById(req.params.announcementId, req.params.classId);
    return res.status(200).json(data);
};

export const createAnnouncement = async (req, res) => {
    const announcement = await announcementService.createAnnouncement(
        req.params.classId,
        req.body,
        req.user?.id
    );
    return res.status(201).json(announcement);
};

export const updateAnnouncement = async (req, res) => {
    const announcement = await announcementService.updateAnnouncement(
        req.params.announcementId,
        req.params.classId,
        req.body
    );
    return res.status(200).json(announcement);
};

export const deleteAnnouncement = async (req, res) => {
    await announcementService.deleteAnnouncement(
        req.params.announcementId,
        req.params.classId,
        req.user?.id
    );
    return res.status(200).json({ message: 'Announcement deleted' });
};
