import bcrypt from "bcryptjs";
import User from "../models/user.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SES_AWS_SMTP_ENDPOINT,
  port: process.env.SES_AWS_SMTP_PORT,
  auth: {
    user: process.env.SES_AWS_SMTP_USERNAME,
    pass: process.env.SES_AWS_SMTP_PASSWORD,
  },
});

export const getLogin = async (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
  });
};

export const getSignup = async (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    errorMessage: message,
  });
};

export const postLogin = async (req, res, next) => {
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
  const { email, password, confirmPassword } = req.body;
  const user = await User.findOne({ email: email });
  if (user) {
    req.flash("error", "Email already exists. Please login.");
    return res.redirect("/signup");
  }
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
  const info = await transporter.sendMail(mailOptions);
  console.log("Message sent! Message ID: ", info);
  res.redirect("/login");
};

export const postLogout = async (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
};

const authController = {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  postLogout,
};

export default authController;
