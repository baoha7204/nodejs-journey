import express from "express";
import bodyParser from "body-parser";

import adminRouter from "./routes/admin.js";
import shopRouter from "./routes/shop.js";
import { rootPath } from "./utils/helpers.js";
import { get404Page } from "./controllers/error.js";
import { sequelize } from "./utils/database.js";

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(rootPath("public")));
app.use("/admin", adminRouter);
app.use(shopRouter);

// catch all 404
app.use(get404Page);

app.listen(3000);
