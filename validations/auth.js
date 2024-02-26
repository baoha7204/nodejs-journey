import { body } from "express-validator";
import User from "../models/user.js";

export const loginValidation = [
  body("email", "Invalid email!").trim().isEmail().normalizeEmail(),
  body("password", "Password at least 5 characters!")
    .trim()
    .isLength({ min: 5 }),
];

export const signupValidation = [
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
];
