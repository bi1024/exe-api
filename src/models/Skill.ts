import mongoose, { Schema, Types } from "mongoose";

export interface ISkill {
    tutor: Types.ObjectId
    name: string
    description: string
    categories: Types.ObjectId[]
}

const skillSchema = new Schema<ISkill>(
    {
        tutor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: '',
            required: false
        },
        categories: [{
            type: Schema.Types.ObjectId,
            ref: 'SkillCategory',
            required: true
        }]
    }
)

const SkillsModel = mongoose.model<ISkill>('Skill', skillSchema);
export default SkillsModel;