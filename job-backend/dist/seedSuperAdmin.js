"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Admin_1 = __importDefault(require("./models/Admin"));
dotenv_1.default.config();
const seedSuperAdmin = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI || "mongodb://localhost:27017/job-portal");
        console.log("MongoDB Connected");
        const email = process.env.SUPER_ADMIN_EMAIL || "admin@joblink360.com";
        const password = process.env.SUPER_ADMIN_PASSWORD || "Admin@JobLink360!2026";
        const companyName = "JobLink360 Administration";
        const companyLocation = "Nepal";
        const mobileNumber = "9999999999";
        const existingAdmin = await Admin_1.default.findOne({ email });
        if (existingAdmin) {
            console.log("SuperAdmin already exists");
            // Optional: Update role if it exists but is not superadmin
            if (existingAdmin.role !== 'superadmin') {
                existingAdmin.role = 'superadmin';
                await existingAdmin.save();
                console.log("Updated user to superadmin");
            }
            process.exit();
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const superAdmin = new Admin_1.default({
            companyName,
            companyLocation,
            email,
            mobileNumber,
            password: hashedPassword,
            role: "superadmin",
        });
        await superAdmin.save();
        console.log("SuperAdmin Created Successfully");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit();
    }
    catch (error) {
        console.error("Error seeding superadmin:", error);
        process.exit(1);
    }
};
seedSuperAdmin();
