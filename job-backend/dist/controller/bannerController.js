"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.upsertBanner = exports.getBannerByType = exports.getBanners = void 0;
const Banner_1 = __importDefault(require("../models/Banner"));
// Get all banners
const getBanners = async (req, res) => {
    try {
        const banners = await Banner_1.default.find();
        res.status(200).json({
            success: true,
            data: banners,
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
exports.getBanners = getBanners;
// Get banner by type
const getBannerByType = async (req, res) => {
    try {
        const { type } = req.params;
        const banner = await Banner_1.default.findOne({ type, isActive: true });
        if (!banner) {
            // Return default banner data instead of 404
            const defaultBanners = {
                "job-search": {
                    type: "job-search",
                    title: "Find Your Dream Job",
                    subtitle: "Connecting Talent with Opportunity",
                    backgroundImage: "",
                    isActive: true
                },
                "home": {
                    type: "home",
                    title: "Welcome to JobLink360",
                    subtitle: "Your Gateway to Career Success",
                    backgroundImage: "",
                    isActive: true
                },
                "training": {
                    type: "training",
                    title: "Enhance Your Skills",
                    subtitle: "Professional Training Programs",
                    backgroundImage: "",
                    isActive: true
                },
                "about": {
                    type: "about",
                    title: "About Us",
                    subtitle: "Empowering Careers Since Day One",
                    backgroundImage: "",
                    isActive: true
                }
            };
            return res.status(200).json({
                success: true,
                data: defaultBanners[type] || {
                    type,
                    title: "Welcome",
                    subtitle: "",
                    backgroundImage: "",
                    isActive: true
                },
            });
        }
        res.status(200).json({
            success: true,
            data: banner,
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
exports.getBannerByType = getBannerByType;
// Create or update banner
const upsertBanner = async (req, res) => {
    try {
        const { type, title, subtitle, isActive } = req.body;
        const bannerData = {
            type,
            title,
            subtitle,
            isActive: isActive !== undefined ? isActive : true,
        };
        if (req.file) {
            bannerData.backgroundImage = `/uploads/banners/${req.file.filename}`;
        }
        const banner = await Banner_1.default.findOneAndUpdate({ type }, bannerData, {
            new: true,
            upsert: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            data: banner,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to save banner",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.upsertBanner = upsertBanner;
// Delete banner
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBanner = await Banner_1.default.findByIdAndDelete(id);
        if (!deletedBanner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Banner deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete banner",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.deleteBanner = deleteBanner;
