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
        let { search } = req.query as { search: string };
        const { skillCategory: skillCategoryName } = req.query as { skillCategory: string };
        let { minPrice, maxPrice } = req.query as { minPrice: string | number, maxPrice: string | number };

        if(search) search = search.trim();
        minPrice = parseInt(minPrice as string);
        maxPrice = parseInt(maxPrice as string);

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
        const priceFilter = minPrice && maxPrice ? { 
            $and: [
                { hourlyRate: { $gte: minPrice } },
                { hourlyRate: { $lte: maxPrice } }
            ]  
        } : { };

        let tutorFilter;

        try {
            async function filter() {
                let skills;

                // search by tutor name
                tutorFilter = {
                    $and: [
                        tutorNameFilter,
                        priceFilter
                    ]
                }
                skills = await SkillsModel
                    .find(categoriesFilter)
                    .populate({
                        path: 'tutor',
                        match: tutorFilter
                    })

                skills = skills.filter(tutor => tutor.tutor !== null);

                // already have skills -> stop searching more
                if(skills.length) return skills;

                // search by skill 
                tutorFilter = {
                    $and: [
                        priceFilter
                    ]
                }
                skills = await SkillsModel
                    .find({ ...categoriesFilter, name: search })
                    .populate({
                        path: 'tutor',
                        match: tutorFilter
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

    // public async handleFilterTutors2(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         // --- BƯỚC 1: Xử lý và chuẩn bị các tham số đầu vào ---
    //         let { search } = req.query as { search: string };
    //         const { skillCategory: skillCategoryName } = req.query as { skillCategory: string };
    //         const { minPrice, maxPrice } = req.query as { minPrice?: string, maxPrice?: string };

    //         if (search) search = search.trim();

    //         // --- BƯỚC 2: Xây dựng các bộ lọc (Filters) một cách linh hoạt ---
            
    //         const matchStage: any = {};

    //         // 2.1. Lọc theo danh mục kỹ năng
    //         if (skillCategoryName && skillCategoryName !== 'all') {
    //             const skillCategory = await SkillCategoryModel.findOne({ name: skillCategoryName }).lean();
    //             if (!skillCategory) {
    //                 return next(new BadRequest("Skill category is invalid"));
    //             }
    //             matchStage.categories = skillCategory._id;
    //         }

    //         // 2.2. Lọc theo khoảng giá của gia sư
    //         const hourlyRateConditions: any = {};
    //         if (minPrice && !isNaN(parseInt(minPrice))) {
    //             hourlyRateConditions.$gte = parseInt(minPrice);
    //         }
    //         if (maxPrice && !isNaN(parseInt(maxPrice))) {
    //             hourlyRateConditions.$lte = parseInt(maxPrice);
    //         }
    //         if (Object.keys(hourlyRateConditions).length > 0) {
    //             // Điều kiện này sẽ được áp dụng cho trường của tutor sau khi $lookup
    //             matchStage['tutor.hourlyRate'] = hourlyRateConditions;
    //         }
                
    //         // 2.3. Lọc theo tên tutor HOẶC tên skill (chỉ thêm điều kiện này nếu có search)
    //         if (search) {
    //             matchStage.$or = [
    //                 { 'name': { $regex: search, $options: 'i' } },
    //                 { 'tutor.fullname': { $regex: search, $options: 'i' } }
    //             ];
    //         }

    //         // --- BƯỚC 3: Xây dựng và thực thi Aggregation Pipeline ---

    //         const pipeline = [
    //             // Giai đoạn 1: Join với collection 'users' để lấy thông tin tutor
    //             {
    //                 $lookup: {
    //                     from: 'users',
    //                     localField: 'tutor',
    //                     foreignField: '_id',
    //                     as: 'tutor'
    //                 }
    //             },
    //             // Giai đoạn 2: Tách mảng tutor (chỉ có 1 phần tử) thành object
    //             // Đồng thời loại bỏ các skill không có tutor hợp lệ
    //             { $unwind: '$tutor' },
                
    //             // Giai đoạn 3: Áp dụng TẤT CẢ các điều kiện lọc trong một lần
    //             { $match: matchStage },

    //             // Giai đoạn 4 (Tùy chọn nhưng khuyến khích): Dọn dẹp kết quả trả về
    //             // {
    //             //     $project: {
    //             //         // Lấy các trường của Skill
    //             //         _id: 1,
    //             //         name: 1,
    //             //         description: 1,
    //             //         categories: 1,
    //             //         // "Nâng cấp" các trường của Tutor ra ngoài cho dễ dùng
    //             //         tutor: { // Giữ lại object tutor nếu muốn
    //             //             _id: '$tutor._id',
    //             //             fullname: '$tutor.fullname',
    //             //             avatar: '$tutor.avatar',
    //             //             hourlyRate: '$tutor.hourlyRate'
    //             //         }
    //             //     }
    //             // }
    //         ];

    //         // Thực thi pipeline chỉ 1 LẦN DUY NHẤT
    //         const skills = await SkillsModel.aggregate(pipeline);

    //         const tutors : ITutorDuplicated[] = [];
    //         try {
    //             for(const skillDetails of skills) {
    //                 const skill : ISkill = {
    //                     _id: skillDetails._id,
    //                     name: skillDetails.name,
    //                     description: skillDetails.description,
    //                     categories: skillDetails.categories
    //                 }
    //                 const tutor : ITutorDuplicated = {
    //                     _id: skillDetails.tutor._id,
    //                     username: skillDetails.tutor.username,
    //                     fullname: skillDetails.tutor.fullname,
    //                     skill
    //                 }
    //                 tutors.push(tutor);
    //             }
    //         } catch(err) {
    //             next(err);
    //             return;
    //         }
            
    //         const tutorsFormatted : ITutor[] = [];
    //         for(const tutor of tutors) {
    //             const index = tutorsFormatted.findIndex(e => e._id === tutor._id);
    //             if(index === -1) {
    //                 const tutorFormatted : ITutor = {
    //                     _id: tutor._id,
    //                     fullname: tutor.fullname,
    //                     username: tutor.username,
    //                     skills: [tutor.skill]
    //                 }
    //                 tutorsFormatted.push(tutorFormatted);
    //             } else {
    //                 tutorsFormatted[index].skills.push(tutor.skill);
    //             }
    //         }

    //         res.status(StatusCodes.OK).json({ data: tutorsFormatted });

    //     } catch (err) {
    //         next(err);
    //     }
    // }
}