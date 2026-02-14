"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const historyService_1 = require("../services/historyService");
const router = (0, express_1.Router)();
// Get history with filters
router.get("/", authMiddleware_1.protect, authMiddleware_1.checkSuperAdmin, async (req, res) => {
    try {
        const { entityType, action, startDate, endDate, limit = "100", skip = "0" } = req.query;
        const filters = {};
        if (entityType)
            filters.entityType = entityType;
        if (action)
            filters.action = action;
        if (startDate)
            filters.startDate = startDate;
        if (endDate)
            filters.endDate = endDate;
        const { history, total } = await (0, historyService_1.getHistory)(filters, parseInt(limit), parseInt(skip));
        res.json({ history, total });
    }
    catch (err) {
        console.error("Error fetching history:", err);
        res.status(500).json({ message: "Failed to fetch history" });
    }
});
// Get history for logged in employer (filter by targetOwnerId)
router.get("/my-history", authMiddleware_1.protect, async (req, res) => {
    try {
        const adminId = req.user?._id || req.user?.id;
        // Verify user is an admin (employer) or superadmin
        if (req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
            return res.status(403).json({ message: "Not authorized" });
        }
        const { entityType, action, startDate, endDate, limit = "100", skip = "0" } = req.query;
        const filters = {};
        filters.targetOwnerId = adminId; // Force filter by logged in employer ID
        if (entityType)
            filters.entityType = entityType;
        if (action)
            filters.action = action;
        if (startDate)
            filters.startDate = startDate;
        if (endDate)
            filters.endDate = endDate;
        const { history, total } = await (0, historyService_1.getHistory)(filters, parseInt(limit), parseInt(skip));
        res.json({ history, total });
    }
    catch (err) {
        console.error("Error fetching my history:", err);
        res.status(500).json({ message: "Failed to fetch history" });
    }
});
exports.default = router;
