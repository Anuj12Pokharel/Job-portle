import { Schema, model, Document } from "mongoose";

export interface ITalent extends Document {
  fullName: string;
  designation: string;
  email: string;
  phone: string;
  expertise: string;
  employmentStatus: string;
  cv?: string;
}

const talentSchema = new Schema<ITalent>(
  {
    fullName: { type: String, required: true },
    designation: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    expertise: { type: String, required: true },
    employmentStatus: { type: String, required: true },
    cv: { type: String }, // path to uploaded CV
  },
  { timestamps: true }
);

export default model<ITalent>("Talent", talentSchema);
