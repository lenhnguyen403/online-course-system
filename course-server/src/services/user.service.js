import User from '../models/user.model.js';
import { passwordEncoded } from '../middlewares/hash_password.middleware.js';
import { ROLE } from '../constants/Role.js';
import { ACTIVE_STATUS } from '../constants/ActiveStatus.js';

export const getUsers = async (pagination, filter = {}) => {
    const [data, total] = await Promise.all([
        User.find(filter)
            .select('-password')
            .skip(pagination.offset)
            .limit(pagination.limit)
            .sort({ createdAt: -1 })
            .lean(),
        User.countDocuments(filter),
    ]);
    return { data, total, ...pagination };
};

export const createUser = async (body) => {
    const exists = await User.findOne({ email: body.email });
    if (exists) throw { status: 400, message: 'Email already registered' };
    body.password = await passwordEncoded(body.password);
    const user = await User.create(body);
    const u = user.toObject();
    delete u.password;
    return u;
};

export const getUserById = async (id) => {
    const user = await User.findById(id).select('-password');
    if (!user) throw { status: 404, message: 'User not found' };
    return user;
};

export const updateUser = async (id, body) => {
    const allowed = ['fullName', 'phoneNumber', 'dateOfBirth', 'address', 'identityNumber', 'role'];
    const update = { ...body };
    delete update.password;
    delete update.email;
    Object.keys(update).forEach((k) => {
        if (!allowed.includes(k)) delete update[k];
    });
    const user = await User.findByIdAndUpdate(id, update, { new: true }).select('-password');
    if (!user) throw { status: 404, message: 'User not found' };
    return user;
};

export const updateStatus = async (id, status) => {
    if (!Object.values(ACTIVE_STATUS).includes(status))
        throw { status: 400, message: 'Invalid status' };
    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-password');
    if (!user) throw { status: 404, message: 'User not found' };
    return user;
};

export const deactivateUser = async (id, userId) => {
    const user = await User.findById(id);
    if (!user) throw { status: 404, message: 'User not found' };
    await user.softDelete(userId);
    const u = user.toObject();
    delete u.password;
    return u;
};

export const sendCredentials = async (id) => {
    const user = await User.findById(id);
    if (!user) throw { status: 404, message: 'User not found' };
    // TODO: send email with login link / temp password
    return { message: 'Credentials sent to user email' };
};
