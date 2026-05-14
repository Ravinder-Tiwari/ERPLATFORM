import dotenv from "dotenv";
dotenv.config({});

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import atsRoutes from "./routes/atsRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import questionRouter from "./routes/questions.routes.js";
import stepRouter from "./routes/step.routes.js";
import roadmapRouter from "./routes/roadmap.routes.js";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chatAI.routes.js";

const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= Middleware =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {

    // Allow requests without origin
    if (!origin) return callback(null, true);

    if (!allowedOrigins.includes(origin)) {
      return callback(new Error("Not allowed by CORS"));
    }

    return callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ================= API Routes =================
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/contact", contactRoutes);
app.use("/api/roadmap", roadmapRouter);
app.use("/api/step", stepRouter);
app.use("/api/question", questionRouter);
app.use("/api/auth", authRouter);
app.use("/api/ai", chatRouter);
app.use("/api", atsRoutes);

// ================= Static Public Folder =================

// backend/src/public
const publicPath = path.join(__dirname, "public");

// Serve static files
app.use(express.static(publicPath));

// Serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

export default app;