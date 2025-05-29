import mongoose, { Schema, Types } from "mongoose"

export interface ITutorProfile {
    user: Types.ObjectId
    bio: string
    rating?: number
    schedule?: string
    qualificationIds?: Types.ObjectId[],

    hourlyRate?: number
}

const tutorProfileSchema = new Schema<ITutorProfile>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        bio: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: false
        },
        //...

        hourlyRate: {
            type: Number,
            required: false
        }
    }
)

const TutorProfilesModel = mongoose.model('TutorProfile', tutorProfileSchema, 'tutor_profiles');
export default TutorProfilesModel;