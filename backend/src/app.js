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


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Serve static files from public folder
// app.use(express.static(path.join(__dirname, "public")));


// Allow localhost and production frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {

    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("Not allowed by CORS"));
    }

    return callback(null, true);
  },

  credentials: true
};


app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(cors(corsOptions));


// api routes
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


export default app;