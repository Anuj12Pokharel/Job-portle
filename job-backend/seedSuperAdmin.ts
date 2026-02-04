import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin";

dotenv.config();

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/job-portal");
        console.log("MongoDB Connected");

        const email = process.env.SUPER_ADMIN_EMAIL || "admin@joblink360.com";
        const password = process.env.SUPER_ADMIN_PASSWORD || "Admin@JobLink360!2026";
        const companyName = "JobLink360 Administration";
        const companyLocation = "Nepal";
        const mobileNumber = "9999999999";

        const existingAdmin = await Admin.findOne({ email });
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const superAdmin = new Admin({
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
    } catch (error) {
        console.error("Error seeding superadmin:", error);
        process.exit(1);
    }
};

seedSuperAdmin();
