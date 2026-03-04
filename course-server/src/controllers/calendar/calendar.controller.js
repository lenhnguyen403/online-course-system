import * as calendarService from '../../services/calendar.service.js';

export const getMyCalendarEvents = async (req, res) => {
    const start = req.query.start ? new Date(req.query.start) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = req.query.end ? new Date(req.query.end) : new Date(new Date().setMonth(new Date().getMonth() + 2));
    const data = await calendarService.getCalendarEvents(req.user.id, req.user.role, start, end);
    return res.status(200).json(data);
};
