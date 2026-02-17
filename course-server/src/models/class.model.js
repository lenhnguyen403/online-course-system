import mongoose from 'mongoose'
import { slugPlugin, softDeletePlugin } from '../utils/basePlugin'
import { CLASS_STATUS } from '../constants/ClassStatus'

const classSchema = new mongoose.Schema(
    {
        classCode: { type: String, required: true, unique: true },
        className: { type: String, required: true },
        courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
        startDate: Date,
        endDate: Date,
        status: {
            type: String,
            enum: [
                CLASS_STATUS.UPCOMMING, 
                CLASS_STATUS.ONGOING, 
                CLASS_STATUS.FINISHED
            ],
            default: CLASS_STATUS.UPCOMMING,
        },
        teacherIds: [
            { type: Schema.Types.ObjectId, ref: "User" }
        ],
    },
    { timestamps: true }
)

classSchema.index({ courseId: 1 })
classSchema.index({ teacherIds: 1 })
classSchema.plugin(softDeletePlugin)
classSchema.plugin(slugPlugin, 'className')

const Class = mongoose.model('Class', classSchema)

export default Class