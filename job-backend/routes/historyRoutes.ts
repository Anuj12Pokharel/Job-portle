import { Router } from "express";
import { protect, checkSuperAdmin } from "../middleware/authMiddleware";
import { getHistory } from "../services/historyService";

const router = Router();

// Get history with filters
router.get("/", protect, checkSuperAdmin, async (req, res) => {
    try {
        const { entityType, action, startDate, endDate, limit = "100", skip = "0" } = req.query;

        const filters: any = {};
        if (entityType) filters.entityType = entityType;
        if (action) filters.action = action;
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;

        const { history, total } = await getHistory(
            filters,
            parseInt(limit as string),
            parseInt(skip as string)
        );

        res.json({ history, total });
    } catch (err) {
        console.error("Error fetching history:", err);
        res.status(500).json({ message: "Failed to fetch history" });
    }
});

export default router;
