import dotenv from "dotenv";
dotenv.config({});
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import atsRoutes from "./routes/atsRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
import questionRouter from "./routes/questions.routes.js";
import stepRouter from "./routes/step.routes.js";
import roadmapRouter from "./routes/roadmap.routes.js";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chatAI.routes.js";


const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allow both localhost and Vercel URLs
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://job-portal-frontend-mu.vercel.app' // Production URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // If there's no origin (like curl or postman requests), allow it
    if (!origin) return callback(null, true);
    
    // Allow only allowed origins
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'));
    }
    return callback(null, true);
  },
  credentials: true // To allow cookies or other credentials
};

app.use(cors(corsOptions));


// api routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use('/api/contact', contactRoutes);
app.use("/api/roadmap", roadmapRouter)
app.use("/api/step", stepRouter)
app.use("/api/question", questionRouter)
app.use("/api/auth", authRouter)
app.use('/api/ai', chatRouter);  // This will prefix all AI routes with /api

app.use('/api', atsRoutes);  // This will prefix all ATS routes with /api



export default app