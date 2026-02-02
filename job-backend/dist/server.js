<<<<<<< HEAD
=======

>>>>>>> 108f8ad8d4773195aac884c882cba97758519749
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userFormRoutes_1 = __importDefault(require("./routes/userFormRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const AdminRoutes_1 = __importDefault(require("./routes/AdminRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const BlogRoutes_1 = __importDefault(require("./routes/BlogRoutes"));
const trainingRoutes_1 = __importDefault(require("./routes/trainingRoutes"));
const clientLogoRoutes_1 = __importDefault(require("./routes/clientLogoRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
const historyRoutes_1 = __importDefault(require("./routes/historyRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const talentRoutes_1 = __importDefault(require("./routes/talentRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.json({ message: "Welcome to the Job Backend API" });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/user", userRoutes_1.default);
app.use("/api/form", userFormRoutes_1.default);
app.use("/api/jobs", jobRoutes_1.default);
app.use("/api/admin", AdminRoutes_1.default);
app.use("/api/contact", contactRoutes_1.default);
app.use("/api/blog", BlogRoutes_1.default);
app.use("/api/training", trainingRoutes_1.default);
app.use("/api/client-logos", clientLogoRoutes_1.default);
app.use("/api/team", teamRoutes_1.default);
app.use("/api/history", historyRoutes_1.default);
app.use("/api/talent", talentRoutes_1.default);
const logsDir = path_1.default.join(__dirname, "logs");
if (!fs_1.default.existsSync(logsDir))
    fs_1.default.mkdirSync(logsDir, { recursive: true });
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(logsDir, "access.log"), {
    flags: "a",
});
app.use((0, morgan_1.default)("combined", { stream: accessLogStream }));
app.use((0, morgan_1.default)("dev"));
app.use((err, req, res, _next) => {
    try {
        const entry = `${new Date().toISOString()} ${req.method} ${req.originalUrl} - ${err instanceof Error ? err.stack : err}\n`;
        fs_1.default.appendFileSync(path_1.default.join(logsDir, "error.log"), entry);
    }
    catch (writeErr) {
        console.error("Failed writing to error.log", writeErr);
    }
    console.error(err);
    if (!res.headersSent)
        res.status(500).json({ message: "Internal Server Error" });
});
process.on("unhandledRejection", (reason) => {
    const entry = `${new Date().toISOString()} UNHANDLED_REJECTION - ${reason}\n`;
    try {
        fs_1.default.appendFileSync(path_1.default.join(logsDir, "error.log"), entry);
    }
    catch (e) {
        console.error(e);
    }
    console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
    const entry = `${new Date().toISOString()} UNCAUGHT_EXCEPTION - ${err.stack || err}\n`;
    try {
        fs_1.default.appendFileSync(path_1.default.join(logsDir, "error.log"), entry);
    }
    catch (e) {
        console.error(e);
    }
    console.error("Uncaught Exception:", err);
    process.exit(1);
});
const clientDistPath = path_1.default.join(__dirname, "..", "vite-project", "dist");
if (fs_1.default.existsSync(clientDistPath)) {
    app.use(express_1.default.static(clientDistPath));
    // Catch-all for SPA: use app.use to avoid path-to-regexp wildcard issues on Express v5
    app.use((req, res) => {
        if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
            return res.status(404).end();
        }
        res.sendFile(path_1.default.join(clientDistPath, "index.html"));
    });
}
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
}
mongoose_1.default
    .connect(mongoUri)
    .then(() => {
    console.log(" MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(` Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
});
<<<<<<< HEAD
=======
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userFormRoutes_1 = __importDefault(require("./routes/userFormRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const AdminRoutes_1 = __importDefault(require("./routes/AdminRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (_req, res) => {
    res.json({ message: "Welcome to the Job Backend API" });
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/form", userFormRoutes_1.default);
app.use("/api/jobs", jobRoutes_1.default);
app.use("/api/admin", AdminRoutes_1.default);
app.use("/api/contact", contactRoutes_1.default);
const logsDir = path_1.default.join(__dirname, "logs");
if (!fs_1.default.existsSync(logsDir))
    fs_1.default.mkdirSync(logsDir, { recursive: true });
const accessLogStream = fs_1.default.createWriteStream(path_1.default.join(logsDir, "access.log"), {
    flags: "a",
});
app.use((0, morgan_1.default)("combined", { stream: accessLogStream }));
app.use((0, morgan_1.default)("dev"));
app.use((err, req, res, _next) => {
    try {
        const entry = `${new Date().toISOString()} ${req.method} ${req.originalUrl} - ${err instanceof Error ? err.stack : err}\n`;
        fs_1.default.appendFileSync(path_1.default.join(logsDir, "error.log"), entry);
    }
    catch (writeErr) {
        console.error("Failed writing to error.log", writeErr);
    }
    console.error(err);
    if (!res.headersSent)
        res.status(500).json({ message: "Internal Server Error" });
});
process.on("unhandledRejection", (reason) => {
    const entry = `${new Date().toISOString()} UNHANDLED_REJECTION - ${reason}\n`;
    try {
        fs_1.default.appendFileSync(path_1.default.join(logsDir, "error.log"), entry);
    }
    catch (e) {
        console.error(e);
    }
    console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
    const entry = `${new Date().toISOString()} UNCAUGHT_EXCEPTION - ${err.stack || err}\n`;
    try {
        fs_1.default.appendFileSync(path_1.default.join(logsDir, "error.log"), entry);
    }
    catch (e) {
        console.error(e);
    }
    console.error("Uncaught Exception:", err);
    process.exit(1);
});
const clientDistPath = path_1.default.join(__dirname, "..", "vite-project", "dist");
if (fs_1.default.existsSync(clientDistPath)) {
    app.use(express_1.default.static(clientDistPath));
    // Catch-all for SPA: use app.use to avoid path-to-regexp wildcard issues on Express v5
    app.use((req, res) => {
        if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
            return res.status(404).end();
        }
        res.sendFile(path_1.default.join(clientDistPath, "index.html"));
    });
}
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
}
mongoose_1.default
    .connect(mongoUri)
    .then(() => {
    console.log(" MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(` Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
});

>>>>>>> 108f8ad8d4773195aac884c882cba97758519749
