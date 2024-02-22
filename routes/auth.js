import express from "express";
import { body } from "express-validator";
import { asyncHandler } from "../utils/helpers.js";
import authController from "../controllers/auth.js";
import { isAuth } from "../middlewares/is-auth.js";
import User from "../models/user.js";

const authRouter = express.Router();

authRouter.get("/login", asyncHandler(authController.getLogin));

authRouter.post(
  "/login",
  [
    body("email", "Invalid email!").trim().isEmail().normalizeEmail(),
    body("password", "Password at least 5 characters!")
      .trim()
      .isLength({ min: 5 }),
  ],
  asyncHandler(authController.postLogin)
);

authRouter.get("/signup", asyncHandler(authController.getSignup));

authRouter.post(
  "/signup",
  [
    body("email", "Invalid email!")
      .trim()
      .isEmail()
      .normalizeEmail()
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error("Email already exists! Please login.");
        }
        return true;
      }),
    body("password", "Password at least 5 characters!")
      .trim()
      .isLength({ min: 5 }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.");
      }
      return true;
    }),
  ],
  asyncHandler(authController.postSignup)
);

authRouter.post("/logout", isAuth, asyncHandler(authController.postLogout));

authRouter.get("/reset", asyncHandler(authController.getReset));

authRouter.post("/reset", asyncHandler(authController.postReset));

authRouter.get("/reset/:token", asyncHandler(authController.getNewPassword));

authRouter.post("/new-password", asyncHandler(authController.postNewPassword));

export default authRouter;
