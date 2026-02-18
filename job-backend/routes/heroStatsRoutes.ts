import { Router } from "express";
import { getHeroStats } from "../services/historyService";

const router = Router();

// Get hero stats for the homepage
router.get("/", async (req, res) => {
    try {
        const stats = await getHeroStats();
        res.json(stats);
    } catch (err) {
        console.error("Error fetching hero stats:", err);
        res.status(500).json({ message: "Failed to fetch hero stats" });
    }
});

export default router;