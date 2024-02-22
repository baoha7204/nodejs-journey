import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { validationResult } from "express-validator";
import User from "../models/user.js";
import { extractFlashMessage } from "../utils/helpers.js";

const transporter = nodemailer.createTransport({
  host: process.env.SES_AWS_SMTP_ENDPOINT,
  port: process.env.SES_AWS_SMTP_PORT,
  auth: {
    user: process.env.SES_AWS_SMTP_USERNAME,
    pass: process.env.SES_AWS_SMTP_PASSWORD,
  },
});

export const getLogin = async (req, res, next) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage,
    successMessage,
    validationErrors: [],
    oldInput: req.oldInput,
  });
};

export const getSignup = async (req, res, next) => {
  const message = extractFlashMessage(req, "error");
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    errorMessage: message,
    validationErrors: [],
    oldInput: req.oldInput,
  });
};

export const postLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: req.oldInput,
    });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/login");
  }
  req.session.user = user;
  await req.session.save();
  res.redirect("/");
};

export const postSignup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      pageTitle: "Signup",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: req.oldInput,
    });
  }
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({
    email: email,
    password: hashedPassword,
    cart: { items: [] },
  });
  await newUser.save();
  // send success email
  const mailOptions = {
    from: process.env.SES_AWS_SMTP_SENDER,
    to: email,
    subject: "Signup status",
    html: "<h1>You successfully sign up to MyNode app kkk</h1>",
  };
  await transporter.sendMail(mailOptions);
  res.redirect("/login");
};

export const postLogout = async (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
};

export const getReset = async (req, res, next) => {
  const errorMessage = extractFlashMessage(req, "error");
  const successMessage = extractFlashMessage(req, "success");
  res.render("auth/reset", {
    pageTitle: "Reset password",
    path: "/reset",
    errorMessage,
    successMessage,
  });
};

export const postReset = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    req.flash("error", "Wrong format email!");
    return res.redirect("/reset");
  }
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      req.flash(
        "error",
        "Something wrong when creating token. Please try again!"
      );
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash("error", "Invalid email!");
      return res.redirect("/reset");
    }
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 60 * 60 * 1000; // 1 hour = 3600000 ms
    await user.save();
    const mailOptions = {
      from: process.env.SES_AWS_SMTP_SENDER,
      to: email,
      subject: "Password reset",
      html: `
        <h1>You requested a password change!</h1>
        <p>Click this link to set a new password: <a href="http://localhost:3000/reset/${token}">Link</a></p>
      `,
    };
    await transporter.sendMail(mailOptions);
  });
  req.flash("success", "Please check your email for confirmation!");
  res.redirect("/reset");
};

export const getNewPassword = async (req, res, next) => {
  const { token } = req.params;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    req.flash("error", "Invalid token or token has expired. Please try again!");
    return res.redirect("/reset");
  }
  const message = extractFlashMessage(req, "error");
  res.render("auth/new-password", {
    pageTitle: "Update password",
    path: "/reset",
    errorMessage: message,
    userId: user._id.toString(),
    passwordToken: token,
  });
};

export const postNewPassword = async (req, res, next) => {
  const { password, passwordToken, userId } = req.body;
  const user = await User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {
      $gt: Date.now(),
    },
    _id: userId,
  });
  if (!user) {
    req.flash("error", "Invalid token or token has expired. Please try again!");
    return res.redirect("/reset");
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();
  req.flash("success", "Password has been updated!");
  res.redirect("/login");
};

const authController = {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  postLogout,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
};

export default authController;
