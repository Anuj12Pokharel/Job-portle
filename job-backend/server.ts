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

import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the Job Backend API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/form", userFormRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/contact", contactRoutes);

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
