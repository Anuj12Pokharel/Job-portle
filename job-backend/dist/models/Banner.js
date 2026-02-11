"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bannerSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
        enum: ["home", "job-search", "training", "about"],
        unique: true
    },
    backgroundImage: { type: String, required: true },
    title: { type: String },
    subtitle: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const Banner = (0, mongoose_1.model)("Banner", bannerSchema);
exports.default = Banner;
