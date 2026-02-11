import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env.production") });

const MONGO_URI = process.env.MONGO_URI || "";

// Job level values that need to be moved
const JOB_LEVELS = [
    "Junior",
    "Middle Level",
    "Senior",
    "Entry Level",
    "Mid-Level",
    "Senior Level",
    "Executive",
    "Intern",
    "Fresher"
];

interface JobDoc {
    _id: any;
    category: string;
    jobLevel?: string;
    industry?: string;
}

async function migrateJobCategories() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB successfully");

        const db = mongoose.connection.db;
        if (!db) {
            throw new Error("Database connection not established");
        }

        const jobsCollection = db.collection("jobs");

        // Find all jobs where category is actually a job level
        const jobsToFix = await jobsCollection.find({
            category: { $in: JOB_LEVELS }
        }).toArray() as JobDoc[];

        console.log(`Found ${jobsToFix.length} jobs with incorrect categories`);

        if (jobsToFix.length === 0) {
            console.log("No jobs need migration. All categories are correct!");
            await mongoose.connection.close();
            return;
        }

        let updated = 0;
        for (const job of jobsToFix) {
            const currentCategory = job.category;
            const currentJobLevel = job.jobLevel;

            // If category is a job level, move it to jobLevel
            if (JOB_LEVELS.includes(currentCategory)) {
                // Determine new category based on industry or set to "Other"
                let newCategory = "Other";

                if (job.industry) {
                    newCategory = job.industry;
                } else {
                    // Set to "Other" if we don't have industry info
                    newCategory = "Other";
                }

                // Update the job
                await jobsCollection.updateOne(
                    { _id: job._id },
                    {
                        $set: {
                            category: newCategory,
                            jobLevel: currentJobLevel || currentCategory // Use existing jobLevel, or the old category value
                        }
                    }
                );

                updated++;
                console.log(`Updated job ${job._id}: category "${currentCategory}" → "${newCategory}", jobLevel → "${currentJobLevel || currentCategory}"`);
            }
        }

        console.log(`\n✅ Migration complete!`);
        console.log(`Updated ${updated} jobs`);
        console.log(`\nSummary:`);
        console.log(`- Moved job levels from category field to jobLevel field`);
        console.log(`- Set category to industry value or "Other" as fallback`);
        console.log(`\nNote: You may want to manually review jobs with category="Other" and set proper categories.`);

        await mongoose.connection.close();
        console.log("Database connection closed");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

// Run migration
migrateJobCategories();
