import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "user" | "tutor" | "admin";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  fullname: string;
  phone: string;
  bio?:string;
  avatarUrl?: string;
  role: UserRole;
  accountBalance: number;
  hourlyRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    bio: { type: String },
    avatarUrl: { type: String },
    role: { type: String, enum: ["user", "tutor", "admin"], default: "user" },
    accountBalance: { type: Number, default: 0 },
    hourlyRate: { type: Number, default: 0 },
  },
  { timestamps: true },
);

userSchema.virtual("skills", {
  ref: "Skill",
  localField: "_id",
  foreignField: "tutor",
  // justOne: false,
});

userSchema.set("toObject", { virtuals: true });
userSchema.set("toJSON", { virtuals: true });

export default mongoose.model<IUser>("User", userSchema);
