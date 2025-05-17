import mongoose, { Schema, Types } from "mongoose"

export interface ITutorProfile {
    bio: string
    rating?: number
    schedule?: string
    qualificationIds?: Types.ObjectId[]
    skillIds?: Types.ObjectId[]
}

const tutorProfileSchema = new Schema<ITutorProfile>(
    {
        bio: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: false
        },
    }
)

const TutorProfileModel = mongoose.model('TutorProfile', tutorProfileSchema, 'tutor_profiles');
export default TutorProfileModel;