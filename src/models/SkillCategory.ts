import mongoose, { Schema } from "mongoose";

export interface ISkillCategory {
    name: string
}

const skillCategorySchema = new Schema<ISkillCategory>(
    {
        name: {
            type: String,
            required: true
        }
    }
)

const SkillCategoryModel = mongoose.model<ISkillCategory>('SkillCategory', skillCategorySchema, 'skill_categories');
export default SkillCategoryModel;