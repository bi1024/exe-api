import BadRequest from "@/errors/BadRequest";
import SkillsModel from "@/models/Skill";
import SkillCategoryModel, { ISkillCategory } from "@/models/SkillCategory";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";

interface ISkill {
  _id: string | Types.ObjectId;
  name: string;
  description: string;
  categories: ISkillCategory[] | number[] | Types.ObjectId[];
}

interface ITutorDuplicated {
_id: string | Types.ObjectId
  username: string
  fullname: string
  skill: ISkill
}

interface ITutor {
  _id: string | Types.ObjectId
  username: string
  fullname: string
  skills: ISkill[]
}

export default class TutorsFilterController {
    public async handleFilterTutors(req: Request, res: Response, next: NextFunction) {
        let { search, skillCategory: skillCategoryName } = req.query as { search: string, skillCategory: string };
        if(search) search = search.trim();

        let skillCategory;
        if(skillCategoryName !== 'all') {
            try {
                skillCategory = await SkillCategoryModel.findOne({ name: skillCategoryName });
                if(!skillCategory) {
                    next(new BadRequest("Skill category is invalid"));
                    return;
                }
            } catch(err) {
                next(err);
                return;
            }
        }

        let skills;
        // fix trường hợp search or category rỗng
        const categoriesFilter = skillCategoryName === 'all' ? { } : { categories : skillCategory };
        const tutorNameFilter = search ? { fullname: search } : { };

        try {
            async function filter() {
                let skills;
                // search by tutor name
                skills = await SkillsModel
                    .find(categoriesFilter)
                    .populate({
                        path: 'tutor',
                        match: tutorNameFilter
                    })

                skills = skills.filter(tutor => tutor.tutor !== null);

                // search by skill 

                // already have skills -> stop searching more
                if(skills.length) return skills;
                skills = await SkillsModel
                    .find({ ...categoriesFilter, name: search })
                    .populate({
                        path: 'tutor'
                    })

                skills = skills.filter(tutor => tutor.tutor !== null);
                return skills;
            }

            skills = await filter();
        } catch(err) {
            next(err);
            return;
        }
        if(!skills) {
            res.status(StatusCodes.OK).json({ data: [] });
            return;
        }

        // console.log(skills);
        const tutors : ITutorDuplicated[] = [];
        try {
            for(const skillDetails of skills) {
                const skill : ISkill = {
                    _id: skillDetails._id,
                    name: skillDetails.name,
                    description: skillDetails.description,
                    categories: skillDetails.categories
                }
                const tutor : ITutorDuplicated = {
                    _id: skillDetails.tutor._id,
                    username: skillDetails.tutor.username,
                    fullname: skillDetails.tutor.fullname,
                    skill
                }
                tutors.push(tutor);
            }
        } catch(err) {
            next(err);
            return;
        }
        
        const tutorsFormatted : ITutor[] = [];
        for(const tutor of tutors) {
            const index = tutorsFormatted.findIndex(e => e._id === tutor._id);
            if(index === -1) {
                const tutorFormatted : ITutor = {
                    _id: tutor._id,
                    fullname: tutor.fullname,
                    username: tutor.username,
                    skills: [tutor.skill]
                }
                tutorsFormatted.push(tutorFormatted);
            } else {
                tutorsFormatted[index].skills.push(tutor.skill);
            }
        }

        res.status(StatusCodes.OK).json({ data: tutorsFormatted });
    }
}