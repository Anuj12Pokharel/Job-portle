import { Request, Response } from "express";
import Userform from "../models/Userform";

export const submitForm = async (req: Request, res: Response) => {
  try {
    const { fullName, designation, email, contact, field, employmentStatus } = req.body as Record<string, string>;
    const resumePath = req.file ? req.file.path : "";

    const form = new Userform({
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
  } catch (error) {
    console.error("Form submission error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
