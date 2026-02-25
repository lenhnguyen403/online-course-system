import mongoose from 'mongoose'
import { slugPlugin, softDeletePlugin } from '../utils/basePlugin.js'

const courseSchema = new mongoose.Schema(
    {
        courseCode: { type: String, required: true, unique: true },
        courseName: { type: String, required: true },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
        durationInMonths: { type: Number, required: true },
        tuitionFee: { type: Number, required: true },
    },
    { timestamps: true }
)

courseSchema.index({ subjectId: 1 })
courseSchema.plugin(softDeletePlugin)
courseSchema.plugin(slugPlugin, 'courseName')

const Course = mongoose.model('Course', courseSchema)

export default Course