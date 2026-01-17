"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userformSchema = new mongoose_1.Schema({
    fullName: String,
    designation: String,
    email: String,
    contact: String,
    field: String,
    employmentStatus: String,
    resume: String,
    createdAt: { type: Date, default: Date.now },
});
const Userform = (0, mongoose_1.model)("Userform", userformSchema);
exports.default = Userform;
