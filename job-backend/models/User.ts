import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

type Role = "user" | "admin" | "superadmin";

export interface ICVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    summary?: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    startYear: string;
    endYear: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    responsibilities?: string;
  }>;
  skills: string[];
  projects?: Array<{
    name: string;
    description: string;
    link?: string;
  }>;
}

export interface IUser extends Document {
  fullName: string;
  mobileNumber: string;
  email: string;
  profilePicture?: string;
  location?: string;
  permanentAddress?: string;
  temporaryAddress?: string;
  academicDegree?: string;
  preferredJobCategory?: string;
  password: string;
  confirmPassword: string;
  role: Role;
  savedJobs: Types.ObjectId[];
  appliedJobs: Types.ObjectId[];
  resetOTP?: string;
  resetOTPExpiry?: Date;
  cvData?: ICVData;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    permanentAddress: {
      type: String,
      default: "",
    },
    temporaryAddress: {
      type: String,
      default: "",
    },
    academicDegree: {
      type: String,
      default: "",
    },
    preferredJobCategory: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    confirmPassword: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    savedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
    appliedJobs: [{ type: Schema.Types.ObjectId, ref: "Application" }],
    resetOTP: {
      type: String,
      select: false,
    },
    resetOTPExpiry: {
      type: Date,
      select: false,
    },
    cvData: {
      personalInfo: {
        fullName: { type: String },
        email: { type: String },
        phone: { type: String },
        address: { type: String },
        summary: { type: String },
      },
      education: [
        {
          institution: { type: String },
          degree: { type: String },
          startYear: { type: String },
          endYear: { type: String },
        },
      ],
      experience: [
        {
          company: { type: String },
          role: { type: String },
          duration: { type: String },
          responsibilities: { type: String },
        },
      ],
      skills: [{ type: String }],
      projects: [
        {
          name: { type: String },
          description: { type: String },
          link: { type: String },
        },
      ],
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User = model<IUser>("User", userSchema);
export default User;
