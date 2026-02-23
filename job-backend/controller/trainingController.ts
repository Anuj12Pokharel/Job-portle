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
    const trainingData = {
      ...req.body,
      image: req.file ? `/uploads/trainings/${req.file.filename}` : req.body.image
    };

    const training = await Training.create(trainingData);
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

    // Build update object with only provided fields
    const updateData: any = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.instructor !== undefined) updateData.instructor = req.body.instructor;
    if (req.body.duration !== undefined) updateData.duration = req.body.duration;
    if (req.body.price !== undefined) updateData.price = req.body.price;
    if (req.body.startDate !== undefined) updateData.startDate = req.body.startDate;
    if (req.body.students !== undefined) updateData.students = Number(req.body.students);

    // Handle shifts: support both shifts[] and shifts keys from FormData
    const shifts = req.body['shifts[]'] || req.body.shifts;
    if (shifts !== undefined) {
      updateData.shifts = Array.isArray(shifts) ? shifts : [shifts];
    }

    // Only update image if a new file was uploaded
    if (req.file) {
      updateData.image = `/uploads/trainings/${req.file.filename}`;
    }

    const updatedTraining = await Training.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }  // No runValidators — avoids false 'image required' failure
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


