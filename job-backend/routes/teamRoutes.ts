import express from "express";
import {
  addTeamMember,
  getTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} from "../controller/teamController";
import uploadTeam from "../middleware/uploadTeam";
import checkAdmin from "../middleware/checkAdmin";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public route (view by all)
router.get("/get", getTeamMembers);

// SuperAdmin routes
router.post(
  "/add",
  protect,
  checkAdmin,
  uploadTeam.single("image"),
  addTeamMember
);

router.put(
  "/update/:id",
  protect,
  checkAdmin,
  uploadTeam.single("image"),
  updateTeamMember
);

router.delete(
  "/delete/:id",
  protect,
  checkAdmin,
  deleteTeamMember
);

export default router;
