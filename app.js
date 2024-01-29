import express from "express";
import bodyParser from "body-parser";

import adminRouter from "./routes/admin.js";
import shopRouter from "./routes/shop.js";
import { asyncHandler, rootPath } from "./utils/helpers.js";
import { get404Page } from "./controllers/error.js";
import { mongoConnect } from "./utils/database.js";
import User from "./models/user.js";

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(rootPath("public")));

app.use(
  asyncHandler(async (req, res, next) => {
    const user = await User.findById("65b78ce1bfccc52fc52eef67");
    req.user = new User(user.username, user.email, user.cart, user._id);
    next();
  })
);

app.use("/admin", adminRouter);
app.use(shopRouter);

// catch all 404
app.use(get404Page);

await mongoConnect();
app.listen(3000);
