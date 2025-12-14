import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

type Role = "user" | "admin" | "superadmin";

export interface IUser extends Document {
  fullName: string;
  preferredJobCategory: string;
  mobileNumber: string;
  email: string;
  profilePicture?: string;
  location?: string;
  password: string;
  confirmPassword: string;
  role: Role;
  savedJobs: Types.ObjectId[];
  appliedJobs: Types.ObjectId[];
  resetOTP?: string;
  resetOTPExpiry?: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    preferredJobCategory: {
      type: String,
      required: true,
      enum: [
        "Software Development",
        "Design",
        "Marketing",
        "Sales",
        "Customer Support",
        "Human Resources",
        "Finance",
        "Operations",
      ],
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
