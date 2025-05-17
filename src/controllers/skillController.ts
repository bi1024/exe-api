import { NextFunction, Request, Response } from "express";
import BadReuest from "../errors/BadRequest.js";
import SkillsModel, { ISkill } from "../models/Skill.js";
import { StatusCodes } from "http-status-codes";
import SkillCategoryModel from "../models/SkillCategory.js";
import { Types } from "mongoose";

export default class SkillController {
    public async handleInsertSingleSkillForTeacher(req: Request, res: Response, next: NextFunction) {
        const { name, description, categories } = req.body as { name?: string | null, description?: string | null, categories?: string[] | null };

        if(name === null || name === undefined || categories === null || categories === undefined) {
            next(new BadReuest('Invalid request, cannot create new skill'));
            return;
        }

        if(name === '') {
            next(new BadReuest('Skill name must be provided'));
            return;
        }

        const categoryIds: Types.ObjectId[] = [];

        for(const category of categories) {
            const doc = await SkillCategoryModel.findOne({ name: category });
            if(!doc) {
                next(new BadReuest('Skill category is invalid'));
                return;
            }
            categoryIds.push(doc._id);
        }

        let skills : ISkill;
        try {
            skills = await SkillsModel.create({ name, description, categoryIds });
        } catch(err) {
            next(err);
            return;
        }

        res.status(StatusCodes.CREATED).json(skills);
    }

    public async handleGetSkillsForTeacher(req: Request, res: Response, next: NextFunction) {

    }
}