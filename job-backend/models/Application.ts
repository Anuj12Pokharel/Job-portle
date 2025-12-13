import { Schema, model, Document, Types } from "mongoose";

export interface IApplication extends Document {
  job: Types.ObjectId;
  user: Types.ObjectId;
  resume?: string | null;
  coverLetter?: string;
  status: "applied" | "reviewed" | "shortlisted" | "rejected" | "hired";
}

const applicationSchema = new Schema<IApplication>(
  {
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: String },
    coverLetter: { type: String },
    status: {
      type: String,
      enum: ["applied", "reviewed", "shortlisted", "rejected", "hired"],
      default: "applied",
    },
  },
  { timestamps: true },
);

const Application = model<IApplication>("Application", applicationSchema);
export default Application;
