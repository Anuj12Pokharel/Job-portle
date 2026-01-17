import { Request, Response } from "express";
import Contact from "../models/Contact";

export const createContact = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body as Record<string, string>;

    const newContact = new Contact({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    await newContact.save();
    res.status(201).json({ message: "Message sent successfully", contact: newContact });
  } catch (error: any) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
