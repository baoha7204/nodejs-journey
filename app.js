import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import adminRouter from "./routes/admin.js";
import shopRouter from "./routes/shop.js";
import { asyncHandler, rootPath } from "./utils/helpers.js";
import { get404Page } from "./controllers/error.js";
import User from "./models/user.js";

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(rootPath("public")));

app.use(
  asyncHandler(async (req, res, next) => {
    const user = await User.findById("65b87578323609400af6f35b");
    req.user = user;
    next();
  })
);

app.use("/admin", adminRouter);
app.use(shopRouter);

// catch all 404
app.use(get404Page);

await mongoose.connect(process.env.MONGO_URI);
const user = await User.findOne();
if (!user) {
  const user = User({
    username: "baoha7204",
    email: "baoha3604@gmail.com",
    cart: { items: [] },
  });
  await user.save();
}
app.listen(3000);
