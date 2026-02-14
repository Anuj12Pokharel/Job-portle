"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLogo = exports.getLogos = exports.addLogo = void 0;
const ClientLogo_1 = __importDefault(require("../models/ClientLogo"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const addLogo = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No logo file uploaded" });
            return;
        }
        const { name } = req.body;
        const logoPath = `uploads/client_logos/${req.file.filename}`;
        const newLogo = new ClientLogo_1.default({
            logo: logoPath,
            name,
        });
        await newLogo.save();
        res.status(201).json(newLogo);
    }
    catch (error) {
        console.error("Error adding client logo:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.addLogo = addLogo;
const getLogos = async (req, res) => {
    try {
        const logos = await ClientLogo_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(logos);
    }
    catch (error) {
        console.error("Error fetching client logos:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getLogos = getLogos;
const deleteLogo = async (req, res) => {
    try {
        const { id } = req.params;
        const logo = await ClientLogo_1.default.findById(id);
        if (!logo) {
            res.status(404).json({ message: "Logo not found" });
            return;
        }
        // Convert relative path "uploads/..." to absolute path
        // Assuming this controller is running from the project root or we can construct path
        const absolutePath = path_1.default.resolve(logo.logo);
        if (fs_1.default.existsSync(absolutePath)) {
            fs_1.default.unlinkSync(absolutePath);
        }
        else {
            // Fallback: try relative to process.cwd() if path.resolve() was weird
            if (fs_1.default.existsSync(logo.logo)) {
                fs_1.default.unlinkSync(logo.logo);
            }
        }
        await ClientLogo_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Logo deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting client logo:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteLogo = deleteLogo;
