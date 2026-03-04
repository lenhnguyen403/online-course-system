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

const REQUIRED_FIELDS = ['email', 'password', 'phoneNumber', 'fullName', 'dateOfBirth', 'address', 'identityNumber', 'role'];
const ROLES = [ROLE.TEACHER, ROLE.STUDENT, ROLE.STAFF];

export const createUser = async (body) => {
    for (const field of REQUIRED_FIELDS) {
        if (body[field] === undefined || body[field] === null || String(body[field]).trim() === '')
            throw { status: 400, message: `Field ${field} is required` };
    }
    if (body.password.length < 6 || body.password.length > 8)
        throw { status: 400, message: 'Password must be 6-8 characters' };
    if (body.rePassword !== body.password)
        throw { status: 400, message: 'Password and re-password do not match' };
    if (!ROLES.includes(body.role))
        throw { status: 400, message: 'Role must be teacher, student or staff' };
    const exists = await User.findOne({ email: body.email });
    if (exists) throw { status: 400, message: 'Email already registered' };
    const { rePassword, ...rest } = body;
    rest.password = await passwordEncoded(rest.password);
    const user = await User.create(rest);
    const u = user.toObject();
    delete u.password;
    // Tự động gửi email thông tin đăng nhập (Feature 2)
    try {
        const { sendCredentialsEmail } = await import('./email.service.js');
        await sendCredentialsEmail(body.email, body.fullName, body.email, body.password);
    } catch (err) {
        console.warn('Send credentials email failed:', err?.message);
    }
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

function randomPassword(len = 8) {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let s = '';
    for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
}

export const sendCredentials = async (id) => {
    const user = await User.findById(id);
    if (!user) throw { status: 404, message: 'User not found' };
    const tempPassword = randomPassword(8);
    user.password = await passwordEncoded(tempPassword);
    await user.save();
    const { sendCredentialsEmail } = await import('./email.service.js');
    await sendCredentialsEmail(user.email, user.fullName, user.email, tempPassword);
    return { message: 'Credentials sent to user email' };
};
