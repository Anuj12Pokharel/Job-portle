import { Request, Response } from "express";
import Team from "../models/Team";
import fs from "fs";
import path from "path";

/**
 * CREATE TEAM MEMBER (SuperAdmin)
 */
export const addTeamMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, designation, bio } = req.body;

    if (!name || !designation || !bio) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const imagePath = req.file
      ? `uploads/team/${req.file.filename}`
      : undefined;

    const team = new Team({
      name,
      designation,
      bio,
      image: imagePath,
    });

    await team.save();
    res.status(201).json(team);
  } catch (error) {
    console.error("Error adding team member:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET TEAM MEMBERS (Public)
 */
export const getTeamMembers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const team = await Team.find().sort({ createdAt: -1 });
    res.status(200).json(team);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE TEAM MEMBER (SuperAdmin)
 */
export const updateTeamMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, designation, bio } = req.body;

    const team = await Team.findById(id);

    if (!team) {
      res.status(404).json({ message: "Team member not found" });
      return;
    }

    // If new image uploaded → delete old image
    if (req.file && team.image) {
      const oldImagePath = path.resolve(team.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      team.image = `uploads/team/${req.file.filename}`;
    }

    team.name = name ?? team.name;
    team.designation = designation ?? team.designation;
    team.bio = bio ?? team.bio;

    await team.save();
    res.status(200).json(team);
  } catch (error) {
    console.error("Error updating team member:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE TEAM MEMBER (SuperAdmin)
 */
export const deleteTeamMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);

    if (!team) {
      res.status(404).json({ message: "Team member not found" });
      return;
    }

    // Delete image file if exists
    if (team.image) {
      const absolutePath = path.resolve(team.image);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }

    await Team.findByIdAndDelete(id);
    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Error deleting team member:", error);
    res.status(500).json({ message: "Server error" });
  }
};
