import * as messageService from '../../services/message.service.js';

export const getMessagesByClass = async (req, res) => {
    const result = await messageService.getMessagesByClass(
        req.params.classId,
        req.user.id,
        req.user.role,
        req.pagination
    );
    return res.status(200).json(result);
};

export const createMessage = async (req, res) => {
    const message = await messageService.createMessage(
        req.params.classId,
        req.user.id,
        req.user.role,
        req.body.content
    );
    return res.status(201).json(message);
};
