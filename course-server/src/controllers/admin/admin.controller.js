import * as userService from '../../services/user.service.js';

export const getUsers = async (req, res) => {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const result = await userService.getUsers(req.pagination, filter);
    return res.status(200).json(result);
};

export const createUser = async (req, res) => {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
};

export const getUserById = async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json(user);
};

export const updateUser = async (req, res) => {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json(user);
};

export const updateStatus = async (req, res) => {
    const { status } = req.body;
    const user = await userService.updateStatus(req.params.id, status);
    return res.status(200).json(user);
};

export const deactivateUser = async (req, res) => {
    const user = await userService.deactivateUser(req.params.id, req.user?.id);
    return res.status(200).json(user);
};

export const sendCredentials = async (req, res) => {
    const result = await userService.sendCredentials(req.params.id);
    return res.status(200).json(result);
};
