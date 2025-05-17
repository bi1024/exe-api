import mongoose, { Schema, Types } from "mongoose";

export interface ISkill {
    name: string
    description: string
    categoryIds: Types.ObjectId[]
}

const skillSchema = new Schema<ISkill>(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: '',
            required: false
        },
        categoryIds: [{
            type: Schema.Types.ObjectId,
            ref: 'SkillCategory',
            required: true
        }]
    }
)

const SkillsModel = mongoose.model<ISkill>('Skill', skillSchema);
export default SkillsModel;