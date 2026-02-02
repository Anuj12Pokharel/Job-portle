"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const teamSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    designation: {
        type: String,
        required: true,
        trim: true,
    },
    bio: {
        type: String,
        required: true,
    },
    image: {
        type: String, // image path or cloudinary URL
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Team", teamSchema);
