import { Schema, model, Document, Types } from "mongoose";

export interface IJob extends Document {
  companyName: string;
  logo?: string;
  position: string;
  category: string;
  location: string;
  jobLevel?: string;
  jobType: "Full-time" | "Part-time" | "Internship" | "Contract" | "Remote";
  salary?: string;
  educationLevel?: string;
  desiredCandidate?: string;
  experience?: string;
  expiryDate?: Date;
  description?: string;
  noOfOpenings?: string;
  industry?: string;
  vehicleLicense?: string;
  twoFourWheeler?: string;
  skills?: string;
  aboutCompany?: string;
  companyWebsite?: string;
  postedBy: Types.ObjectId;
  isFeatured?: boolean;
}

const jobSchema = new Schema<IJob>(
  {
    companyName: { type: String, required: true },
    logo: { type: String },
    position: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    jobLevel: {
      type: String,
      enum: ["Entry-level", "Mid-level", "Senior-level", "Junior", "Executive"],

    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote"],
      default: "Full-time",
    },
    salary: { type: String },
    educationLevel: { type: String },
    desiredCandidate: { type: String },
    experience: { type: String, required: true },
    expiryDate: { type: Date },
    description: { type: String },
    noOfOpenings: { type: String },
    industry: { type: String },
    vehicleLicense: { type: String },
    twoFourWheeler: { type: String },
    skills: { type: String },
    aboutCompany: { type: String },
    companyWebsite: { type: String },
    postedBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Job = model<IJob>("Job", jobSchema);
export default Job;
