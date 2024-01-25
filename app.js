import express from "express";
import bodyParser from "body-parser";

import adminRouter from "./routes/admin.js";
import shopRouter from "./routes/shop.js";
import { asyncHandler, rootPath } from "./utils/helpers.js";
import { get404Page } from "./controllers/error.js";
import { sequelize } from "./utils/database.js";
import Product from "./models/product.js";
import User from "./models/user.js";
import Cart from "./models/cart.js";
import CartItem from "./models/cart-item.js";
import Order from "./models/order.js";
import OrderItem from "./models/order-item.js";

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(rootPath("public")));

app.use(
  asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(1);
    req.user = user;
    next();
  })
);

app.use("/admin", adminRouter);
app.use(shopRouter);

// catch all 404
app.use(get404Page);

// Product vs User
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

// Cart vs User
Cart.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasOne(Cart);

// Cart vs Product
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

// Order vs User
Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Order);

// Order vs Product
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  .sync()
  .then(() => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "BaoHa", email: "baoha3604@gmail.com" });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    return user.getCart().then((cart) => {
      if (!cart) {
        return user.createCart();
      }
      return Promise.resolve(cart);
    });
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
