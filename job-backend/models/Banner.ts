import { Schema, model, Document } from "mongoose";

export interface IBanner extends Document {
    type: "home" | "job-search" | "training" | "about";
    backgroundImage: string;
    title?: string;
    subtitle?: string;
    isActive: boolean;
}

const bannerSchema = new Schema<IBanner>(
    {
        type: { 
            type: String, 
            required: true, 
            enum: ["home", "job-search", "training", "about"],
            unique: true 
        },
        backgroundImage: { type: String, required: true },
        title: { type: String },
        subtitle: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Banner = model<IBanner>("Banner", bannerSchema);
export default Banner;
