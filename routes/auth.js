import express from "express";
import { asyncHandler } from "../utils/helpers.js";
import authController from "../controllers/auth.js";
import { isAuth } from "../middlewares/is-auth.js";

const authRouter = express.Router();

authRouter.get("/login", asyncHandler(authController.getLogin));

authRouter.post("/login", asyncHandler(authController.postLogin));

authRouter.get("/signup", asyncHandler(authController.getSignup));

authRouter.post("/signup", asyncHandler(authController.postSignup));

authRouter.post("/logout", isAuth, asyncHandler(authController.postLogout));

export default authRouter;
