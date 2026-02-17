import mongoose from 'mongoose'
import { slugPlugin, softDeletePlugin } from '../utils/basePlugin'

const subjectSchema = new mongoose.Schema(
    {
        subjectCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        subjectName: {
            type: String,
            required: true,
            trim: true,
        },
        description: String,
    },
    { timestamps: true }
)

subjectSchema.plugin(softDeletePlugin)
subjectSchema.plugin(slugPlugin, 'subjectName')

const Subject = mongoose.model('Subject', subjectSchema)

export default Subject