import { Request, Response } from "express";
import ServiceInquiry from "../models/ServiceInquiry";

export const createServiceInquiry = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      name,
      phone,
      email,
      address,
      company_size,
      service,
      message,
    } = req.body;

    // Validation
    if (
      !name ||
      !phone ||
      !email ||
      !address ||
      !company_size ||
      !service ||
      !message
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const inquiry = await ServiceInquiry.create({
      name,
      phone,
      email,
      address,
      company_size,
      service,
      message,
    });

    return res.status(201).json({
      message: "Your message has been sent successfully",
      inquiry,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getServiceInquiries = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const inquiries = await ServiceInquiry.find().sort({ createdAt: -1 });
    return res.status(200).json(inquiries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
