"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Job_1 = __importDefault(require("./models/Job"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const run = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("MONGO_URI not found");
            return;
        }
        await mongoose_1.default.connect(mongoUri);
        console.log("Connected to MongoDB");
        const jobs = await Job_1.default.find().sort({ updatedAt: -1 }).limit(5);
        console.log("Last 5 Jobs:");
        jobs.forEach(j => {
            console.log("--------------------------------------------------");
            console.log(`ID: ${j._id}`);
            console.log(`Company: ${j.companyName}`);
            console.log(`Position: ${j.position}`);
            console.log(`Logo: ${j.logo}`);
            console.log(`Is Featured: ${j.isFeatured}`);
            console.log(`Updated At: ${j.updatedAt}`);
        });
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error("Error:", error);
    }
};
run();
