import mongoose from 'mongoose'
import { ROLE } from '../constants/Role.js'
import { ACTIVE_STATUS } from '../constants/ActiveStatus.js'
import { softDeletePlugin } from '../utils/basePlugin.js'
 from 'mongoose-delete'

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email"],
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            maxlength: 100,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        identityNumber: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: [
                ROLE.ADMIN,
                ROLE.TEACHER,
                ROLE.STAFF,
                ROLE.STUDENT
            ],
            required: true,
        },
        status: {
            type: String,
            enum: [
                ACTIVE_STATUS.ACTIVE,
                ACTIVE_STATUS.INACTIVE
            ],
            default: ACTIVE_STATUS.ACTIVE
        },
    },
    { timestamps: true }
)

userSchema.index({ role: 1 })
userSchema.index({ status: 1 })

userSchema.plugin(softDeletePlugin)

const User = mongoose.model('User', userSchema)

export default User