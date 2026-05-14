import { Router } from "express";
import { chatWithAI } from "../services/ai.service.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const chatRouter = Router();

chatRouter.post("/chat", isAuthenticated, chatWithAI);

export default chatRouter;