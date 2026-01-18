<<<<<<< HEAD
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContact = void 0;
const Contact_1 = __importDefault(require("../models/Contact"));
const createContact = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;
        const newContact = new Contact_1.default({
            firstName,
            lastName,
            email,
            phone,
            message,
        });
        await newContact.save();
        res.status(201).json({ message: "Message sent successfully", contact: newContact });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
exports.createContact = createContact;
=======
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContact = void 0;
const Contact_1 = __importDefault(require("../models/Contact"));
const createContact = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;
        const newContact = new Contact_1.default({
            firstName,
            lastName,
            email,
            phone,
            message,
        });
        await newContact.save();
        res.status(201).json({ message: "Message sent successfully", contact: newContact });
    }
    catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
exports.createContact = createContact;
>>>>>>> origin/job
