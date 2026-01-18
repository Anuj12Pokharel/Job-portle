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
// Update a training
export const updateTraining = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedTraining = await Training.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,        // return updated document
        runValidators: true, // validate schema
      }
    );

    if (!updatedTraining) {
      return res.status(404).json({
        success: false,
        message: "Training not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedTraining,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update training",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete a training
export const deleteTraining = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedTraining = await Training.findByIdAndDelete(id);

    if (!deletedTraining) {
      return res.status(404).json({
        success: false,
        message: "Training not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Training deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete training",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};


