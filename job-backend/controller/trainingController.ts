import { Request, Response } from "express";
import Training from "../models/Training";

// Get all trainings
export const getTrainings = async (req: Request, res: Response) => {
    try {
        const trainings = await Training.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: trainings.length,
            data: trainings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

// Create a new training
export const createTraining = async (req: Request, res: Response) => {
    try {
        const training = await Training.create(req.body);
        res.status(201).json({
            success: true,
            data: training,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid data",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
