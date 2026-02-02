"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const talentSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    designation: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    expertise: { type: String, required: true },
    employmentStatus: { type: String, required: true },
    cv: { type: String }, // path to uploaded CV
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Talent", talentSchema);
