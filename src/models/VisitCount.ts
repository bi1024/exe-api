// models/Visit.ts
import mongoose, { Schema } from "mongoose";

const visitCountsSchema = new Schema({
  date: { type: Date, required: true, unique: true },
  count: { type: Number, default: 1 },
});

const VisitCountsModel = mongoose.model(
  "TutorProfile",
  visitCountsSchema,
  "visit_counts",
);
export default VisitCountsModel;
