import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import fs from "fs";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes";
import userFormRoutes from "./routes/userFormRoutes";
import jobRoutes from "./routes/jobRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import contactRoutes from "./routes/contactRoutes";
import trainingRoutes from "./routes/trainingRoutes";
import clientLogoRoutes from "./routes/clientLogoRoutes";
import historyRoutes from "./routes/historyRoutes";
import bannerRoutes from "./routes/bannerRoutes";
import cvRoutes from "./routes/cvRoutes";
import statisticsRoutes from "./routes/statisticsRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";

import userRoutes from "./routes/userRoutes";
import BlogRoutes from "./routes/BlogRoutes";
import talentRoutes from "./routes/talentRoutes";
import ServiceInquiryRoutes from "./routes/ServiceInquiry";
import teamRoutes from "./routes/teamRoutes";

// Load environment variables from .env.production in the root directory
dotenv.config({ path: path.join(__dirname, "..", ".env.production") });

const app = express();

// Use absolute path to ensure it works in both dev and production
// In production: __dirname = /app/dist, so we go up one level to /app/uploads
const uploadsPath = path.join(__dirname, "..", "uploads");
app.use("/uploads", express.static(uploadsPath));

// Log uploads path for debugging
console.log("Serving uploads from:", uploadsPath);

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the Job Backend API" });
});

// Health check endpoint for Docker
app.get("/api/health", (_req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/form", userFormRoutes);
app.use("/api/jobs", jobRoutes);
// Mount admin routes without global middleware
// Note: AdminRoutes already has individual route protection
app.use("/api/admin", AdminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/client-logos", clientLogoRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/blog", BlogRoutes);
app.use("/api/blogs", BlogRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/talent", talentRoutes);
app.use("/api/service-inquiry", ServiceInquiryRoutes);

const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const accessLogStream = fs.createWriteStream(path.join(logsDir, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("dev"));

app.use(
  (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction,
  ): void => {
    try {
      const entry = `${new Date().toISOString()} ${req.method} ${req.originalUrl} - ${err instanceof Error ? err.stack : err
        }\n`;
      fs.appendFileSync(path.join(logsDir, "error.log"), entry);
    } catch (writeErr) {
      console.error("Failed writing to error.log", writeErr);
    }
    console.error(err);
    if (!res.headersSent) res.status(500).json({ message: "Internal Server Error" });
  },
);

process.on("unhandledRejection", (reason) => {
  const entry = `${new Date().toISOString()} UNHANDLED_REJECTION - ${reason}\n`;
  try {
    fs.appendFileSync(path.join(logsDir, "error.log"), entry);
  } catch (e) {
    console.error(e);
  }
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  const entry = `${new Date().toISOString()} UNCAUGHT_EXCEPTION - ${err.stack || err}\n`;
  try {
    fs.appendFileSync(path.join(logsDir, "error.log"), entry);
  } catch (e) {
    console.error(e);
  }
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

const clientDistPath = path.join(__dirname, "..", "vite-project", "dist");
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // Catch-all for SPA: use app.use to avoid path-to-regexp wildcard issues on Express v5
  app.use((req, res) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return res.status(404).end();
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI is not defined");
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log(" MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("MongoDB connection failed:", err.message);
  });
