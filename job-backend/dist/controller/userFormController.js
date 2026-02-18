<<<<<<< HEAD
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitForm = void 0;
const Userform_1 = __importDefault(require("../models/Userform"));
const submitForm = async (req, res) => {
    try {
        const { fullName, designation, email, contact, field, employmentStatus } = req.body;
        const resumePath = req.file ? req.file.path : "";
        const form = new Userform_1.default({
            fullName,
            designation,
            email,
            contact,
            field,
            employmentStatus,
            resume: resumePath,
        });
        await form.save();
        res.status(201).json({ message: "Form submitted successfully", form });
    }
    catch (error) {
        console.error("Form submission error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.submitForm = submitForm;
=======
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitForm = void 0;
const Userform_1 = __importDefault(require("../models/Userform"));
const submitForm = async (req, res) => {
    try {
        const { fullName, designation, email, contact, field, employmentStatus } = req.body;
        const resumePath = req.file ? req.file.path : "";
        const form = new Userform_1.default({
            fullName,
            designation,
            email,
            contact,
            field,
            employmentStatus,
            resume: resumePath,
        });
        await form.save();
        res.status(201).json({ message: "Form submitted successfully", form });
    }
    catch (error) {
        console.error("Form submission error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.submitForm = submitForm;
>>>>>>> origin/updated-feature
