"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTraining = exports.updateTraining = exports.createTraining = exports.getTrainings = void 0;
const Training_1 = __importDefault(require("../models/Training"));
// Get all trainings
const getTrainings = async (req, res) => {
    try {
        const trainings = await Training_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: trainings.length,
            data: trainings,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getTrainings = getTrainings;
// Create a new training
const createTraining = async (req, res) => {
    try {
        const training = await Training_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: training,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid data",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.createTraining = createTraining;
// Update a training
const updateTraining = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTraining = await Training_1.default.findByIdAndUpdate(id, req.body, {
            new: true, // return updated document
            runValidators: true, // validate schema
        });
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update training",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.updateTraining = updateTraining;
// Delete a training
const deleteTraining = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTraining = await Training_1.default.findByIdAndDelete(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete training",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.deleteTraining = deleteTraining;
