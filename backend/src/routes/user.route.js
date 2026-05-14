import express from "express";
import { downloadResume, login, logout, register, updateProfile, viewResume } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/resume/:userId/view").get(isAuthenticated, viewResume);
router.route("/resume/:userId/download").get(isAuthenticated, downloadResume);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);

export default router;
