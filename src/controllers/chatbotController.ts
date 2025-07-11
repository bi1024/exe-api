import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import SkillsModel from "@/models/Skill";

export const testChatbot = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const skills = await SkillsModel.find({}).populate({
    path: "tutor",
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are in charge of responding to individual customer queries about a system called SkillFlow, it is a system for online learning through the usage of online video call lessons. It operates by allowing tutors to create slots and students to buy these slots. Here's a sample of a tutor skills item:
       "0": {
    "_id": "682b4499f7fe2492d1dc2f9b",
    "tutor": {
      "hourlyRate": 0,
      "status": "pending",
      "_id": "682b382bf7ab6a1e36d781a6",
      "username": "TutorABC",
      "email": "duyndde180446@fpt.edu.vn",
      "password": "$2b$10$KaLjzeWZnJ9K8Oo8MrUtwewlccNBSzPmuTumPM1g.5yqti.9VXBVe",
      "fullname": "TutorABC",
      "phone": "0123456789",
      "role": "tutor",
      "accountBalance": 0,
      "createdAt": "2025-05-19T13:54:51.753Z",
      "updatedAt": "2025-05-19T13:54:51.753Z",
      "__v": 0,
      "id": "682b382bf7ab6a1e36d781a6"
    },
    "name": "English",
    "description": "English yo",
    "categories": [
      "682812d5afce1a3e4278027e"
    ],
    "__v": 0
  }

  If you deem queries relevant to this aspect, you can respond and then provide link to the relevant tutor, in this case, it will be
  <a href="${process.env.FRONT_END_URL}/student/booking/682b382bf7ab6a1e36d781a6" target="_blank"  class="text-blue-600 underline">Click here</a>
    
  So essentially it's 
  <a href="${process.env.FRONT_END_URL}/student/booking/[tutorId]" target="_blank"  class="text-blue-600 underline">Click here</a>
  Note that it's tutorId as provided by the tutor object,not the outer id

  Here's the list of the tutor:
  ${skills}

  Here's the query of the customer:

  ${prompt}
      
      `,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      },
    });
    const responseData =
      response.candidates && response.candidates.length > 0
        ? response.candidates[0].content?.parts
        : null;
    if (!responseData) {
      throw new Error("Server error");
    } else {
      const responseText = responseData[0].text;
      console.log(response);
      res.status(201).json({ responseText });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
