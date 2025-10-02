const mongoose = require('mongoose');
const validator = require("validator");



const adminSchema = new mongoose.Schema(
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
   
    // Role for RBAC
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
     jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }]
  },
  { timestamps: true }
);
adminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};


module.exports =  mongoose.model("Admin", adminSchema);