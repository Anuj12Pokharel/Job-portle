"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTalents = exports.submitTalent = void 0;
const Talent_1 = __importDefault(require("../models/Talent"));
const submitTalent = async (req, res) => {
    try {
        const { fullName, designation, email, phone, expertise, employmentStatus } = req.body;
        const cvPath = req.file ? `uploads/cv/${req.file.filename}` : undefined;
        const newTalent = new Talent_1.default({
            fullName,
            designation,
            email,
            phone,
            expertise,
            employmentStatus,
            cv: cvPath,
        });
        await newTalent.save();
        res.status(201).json({ message: "Application submitted successfully", talent: newTalent });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.submitTalent = submitTalent;
// SuperAdmin: get all submissions
const getTalents = async (req, res) => {
    try {
        const talents = await Talent_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(talents);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getTalents = getTalents;
