import { NextFunction, Request, Response } from "express";
import BadReuest from "../errors/BadRequest.js";
import SkillsModel from "../models/Skill.js";
import { StatusCodes } from "http-status-codes";
import SkillCategoryModel from "../models/SkillCategory.js";
import { Types } from "mongoose";

export default class SkillController {
    public async handleInsertSingleSkillForTeacher(req: Request, res: Response, next: NextFunction) {
        const userId = '68283fe3afce1a3e4278028a'; // todo
        const { name, description, categories } = req.body as { name?: string | null, description?: string | null, categories?: string[] | null };

        if(name === null || name === undefined || description === null || description === undefined || categories === null || categories === undefined) {
            next(new BadReuest('Invalid request, cannot CREATE new skill'));
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

        let skill;
        try {
            skill = await SkillsModel.create({ tutor: userId, name, description, categories: categoryIds });
        } catch(err) {
            next(err);
            return;
        }

        res.status(StatusCodes.CREATED).json(skill);
    }

    public async handleGetSingleSkill(req: Request, res: Response, next: NextFunction) {
        const { skillId } = req.params;
        let skill;
        try {
            skill = await SkillsModel.findById(skillId).populate('categories');
        } catch(err) {
            next(err);
            return;
        }
        res.status(StatusCodes.OK).json(skill);
    }

    public async handleGetSkillsForTeacher(req: Request, res: Response, next: NextFunction) {
        const userId = '68283fe3afce1a3e4278028a'; // todo

        let skills;

        try {
            skills = await SkillsModel.find({ tutor: userId }).populate('categories');
        } catch(err) {
            next(err);
            return;
        }

        res.status(StatusCodes.OK).json(skills);
    }

    public async handleUpdateSingleSkill(req: Request, res: Response, next: NextFunction) {
        const { skillId } = req.params;
        if(!skillId) {
            next(new BadReuest('Invalid skill, cannot UPDATE skill'));
            return;
        }
        const { name, description, categories } = req.body as { name?: string | null, description?: string | null, categories?: string[] | null };

        if(name === null || name === undefined || description === null || description === undefined || categories === null || categories === undefined) {
            next(new BadReuest('Invalid request, cannot CREATE new skill'));
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

        let skill;
        try {
            skill = await SkillsModel.findByIdAndUpdate(skillId, { name, description, categories: categoryIds });
        } catch(err) {
            next(err);
            return;
        }

        res.status(StatusCodes.OK).json(skill);
    }

    public async handleDeleteSingleSkill(req: Request, res: Response, next: NextFunction) {
        const { skillId } = req.params;
        if(!skillId) {
            next(new BadReuest('Invalid skill, cannot DELETE skill'));
            return;
        }
        try {
            await SkillsModel.findByIdAndDelete(skillId);
        } catch(err) {
            next(err);
            return;
        }

        res.status(StatusCodes.NO_CONTENT).json();
    }
}