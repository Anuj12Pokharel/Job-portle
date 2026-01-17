import { Request, Response } from "express";
import ClientLogo from "../models/ClientLogo";
import fs from "fs";
import path from "path";

export const addLogo = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No logo file uploaded" });
            return;
        }

        const { name } = req.body;
        const logoPath = `uploads/client_logos/${req.file.filename}`;

        const newLogo = new ClientLogo({
            logo: logoPath,
            name,
        });

        await newLogo.save();
        res.status(201).json(newLogo);
    } catch (error) {
        console.error("Error adding client logo:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getLogos = async (req: Request, res: Response): Promise<void> => {
    try {
        const logos = await ClientLogo.find().sort({ createdAt: -1 });
        res.status(200).json(logos);
    } catch (error) {
        console.error("Error fetching client logos:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteLogo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const logo = await ClientLogo.findById(id);

        if (!logo) {
            res.status(404).json({ message: "Logo not found" });
            return;
        }

        // Convert relative path "uploads/..." to absolute path
        // Assuming this controller is running from the project root or we can construct path
        const absolutePath = path.resolve(logo.logo);

        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        } else {
            // Fallback: try relative to process.cwd() if path.resolve() was weird
            if (fs.existsSync(logo.logo)) {
                fs.unlinkSync(logo.logo);
            }
        }

        await ClientLogo.findByIdAndDelete(id);
        res.status(200).json({ message: "Logo deleted successfully" });
    } catch (error) {
        console.error("Error deleting client logo:", error);
        res.status(500).json({ message: "Server error" });
    }
};
