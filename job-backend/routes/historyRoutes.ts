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
}
});

// Get history for logged in employer (filter by targetOwnerId)
router.get("/my-history", protect, async (req, res) => {
    try {
        const adminId = req.user?._id || req.user?.id;
        // Verify user is an admin (employer) or superadmin
        if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
            return res.status(403).json({ message: "Not authorized" });
        }

        const { entityType, action, startDate, endDate, limit = "100", skip = "0" } = req.query;

        const filters: any = {};
        filters.targetOwnerId = adminId; // Force filter by logged in employer ID

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
        console.error("Error fetching my history:", err);
        res.status(500).json({ message: "Failed to fetch history" });
    }
});

export default router;
