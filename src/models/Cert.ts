import mongoose, { Schema, Types } from "mongoose";

export interface ICert {
  tutor: Types.ObjectId;
  name: string;
  description: string;
  imageUrl: string;
  skill?: Types.ObjectId;
}

const certSchema = new Schema<ICert>({
  tutor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
    required: false,
  },
  imageUrl: [
    {
      type: String,
      required: true,
    },
  ],
  skill: {
    type: Schema.Types.ObjectId,
    ref: "Skill",
  },
});

const CertsModel = mongoose.model<ICert>("Cert", certSchema);
export default CertsModel;
