"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeamMember = exports.updateTeamMember = exports.getTeamMembers = exports.addTeamMember = void 0;
const Team_1 = __importDefault(require("../models/Team"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * CREATE TEAM MEMBER (SuperAdmin)
 */
const addTeamMember = async (req, res) => {
    try {
        const { name, designation, bio } = req.body;
        if (!name || !designation || !bio) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const imagePath = req.file
            ? `uploads/team/${req.file.filename}`
            : undefined;
        const team = new Team_1.default({
            name,
            designation,
            bio,
            image: imagePath,
        });
        await team.save();
        res.status(201).json(team);
    }
    catch (error) {
        console.error("Error adding team member:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.addTeamMember = addTeamMember;
/**
 * GET TEAM MEMBERS (Public)
 */
const getTeamMembers = async (req, res) => {
    try {
        const team = await Team_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(team);
    }
    catch (error) {
        console.error("Error fetching team members:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getTeamMembers = getTeamMembers;
/**
 * UPDATE TEAM MEMBER (SuperAdmin)
 */
const updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, designation, bio } = req.body;
        const team = await Team_1.default.findById(id);
        if (!team) {
            res.status(404).json({ message: "Team member not found" });
            return;
        }
        // If new image uploaded → delete old image
        if (req.file && team.image) {
            const oldImagePath = path_1.default.resolve(team.image);
            if (fs_1.default.existsSync(oldImagePath)) {
                fs_1.default.unlinkSync(oldImagePath);
            }
            team.image = `uploads/team/${req.file.filename}`;
        }
        team.name = name ?? team.name;
        team.designation = designation ?? team.designation;
        team.bio = bio ?? team.bio;
        await team.save();
        res.status(200).json(team);
    }
    catch (error) {
        console.error("Error updating team member:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.updateTeamMember = updateTeamMember;
/**
 * DELETE TEAM MEMBER (SuperAdmin)
 */
const deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team_1.default.findById(id);
        if (!team) {
            res.status(404).json({ message: "Team member not found" });
            return;
        }
        // Delete image file if exists
        if (team.image) {
            const absolutePath = path_1.default.resolve(team.image);
            if (fs_1.default.existsSync(absolutePath)) {
                fs_1.default.unlinkSync(absolutePath);
            }
        }
        await Team_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Team member deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting team member:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.deleteTeamMember = deleteTeamMember;
