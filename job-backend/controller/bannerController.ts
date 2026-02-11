import { Request, Response } from "express";
import Banner from "../models/Banner";

// Get all banners
export const getBanners = async (req: Request, res: Response) => {
    try {
        const banners = await Banner.find();
        res.status(200).json({
            success: true,
            data: banners,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

// Get banner by type
export const getBannerByType = async (req: Request, res: Response) => {
    try {
        const { type } = req.params;
        const banner = await Banner.findOne({ type, isActive: true });
        
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }

        res.status(200).json({
            success: true,
            data: banner,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

// Create or update banner
export const upsertBanner = async (req: Request, res: Response) => {
    try {
        const { type, title, subtitle, isActive } = req.body;
        
        const bannerData: any = {
            type,
            title,
            subtitle,
            isActive: isActive !== undefined ? isActive : true,
        };

        if (req.file) {
            bannerData.backgroundImage = `/uploads/banners/${req.file.filename}`;
        }

        const banner = await Banner.findOneAndUpdate(
            { type },
            bannerData,
            { 
                new: true, 
                upsert: true,
                runValidators: true 
            }
        );

        res.status(200).json({
            success: true,
            data: banner,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to save banner",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

// Delete banner
export const deleteBanner = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedBanner = await Banner.findByIdAndDelete(id);

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete banner",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
