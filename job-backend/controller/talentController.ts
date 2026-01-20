import { Request, Response } from "express";
import Talent from "../models/Talent";
import path from "path";

export const submitTalent = async (req: Request, res: Response) => {
  try {
    const { fullName, designation, email, phone, expertise, employmentStatus } = req.body;

    const cvPath = req.file ? `uploads/cv/${req.file.filename}` : undefined;

    const newTalent = new Talent({
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
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// SuperAdmin: get all submissions
export const getTalents = async (req: Request, res: Response) => {
  try {
    const talents = await Talent.find().sort({ createdAt: -1 });
    res.status(200).json(talents);
  } catch (error: any) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
