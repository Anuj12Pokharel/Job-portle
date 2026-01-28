"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const trainingSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: String, required: true },
    startDate: { type: Date, required: true },
    image: { type: String, required: true },
}, { timestamps: true });
const Training = (0, mongoose_1.model)("Training", trainingSchema);
exports.default = Training;
