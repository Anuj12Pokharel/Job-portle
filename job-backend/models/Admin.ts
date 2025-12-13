import { Schema, model, Document, Types } from "mongoose";
import validator from "validator";

export interface IAdmin extends Document {
  companyName: string;
  companyLocation: string;
  email: string;
  mobileNumber: string;
  password: string;
  role: "admin" | "superadmin";
  jobs: Types.ObjectId[];
  resetOTP?: string;
  resetOTPExpiry?: Date;
  logo?: string;
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
    jobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    logo: {
      type: String,
      default: "",
    },
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
