import { Schema, model, Document, Types } from "mongoose";
import validator from "validator";

export interface IAdmin extends Document {
  companyName: string;
  companyLocation: string;
  email: string;
  mobileNumber: string;
  password: string;
  role: "admin" | "superadmin";
  profilePicture?: string;
  jobs: Types.ObjectId[];
  resetOTP?: string;
  resetOTPExpiry?: Date;
  status: "pending" | "approved" | "rejected";
}

const adminSchema = new Schema<IAdmin>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyLocation: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    mobileNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    profilePicture: { type: String },
    jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    resetOTP: {
      type: String,
      select: false,
    },
    resetOTPExpiry: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
);

adminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete (obj as Record<string, unknown>).password;
  return obj;
};

const Admin = model<IAdmin>("Admin", adminSchema);
export default Admin;
