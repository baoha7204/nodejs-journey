import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import session from "express-session";
import flash from "connect-flash";

import adminRouter from "./routes/admin.js";
import shopRouter from "./routes/shop.js";
import authRouter from "./routes/auth.js";
import { get404Page } from "./controllers/error.js";
import { asyncHandler, rootPath } from "./utils/helpers.js";
import { store } from "./utils/db.js";
import { bindReqUser } from "./middlewares/user.js";
import { csrfProtection, csrfToken } from "./middlewares/csrf.js";

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

await mongoose.connect(process.env.MONGO_URI);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(rootPath("public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());
app.use(asyncHandler(bindReqUser));

app.use(csrfToken);

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);

// catch all 404
app.use(get404Page);
app.listen(3000);
