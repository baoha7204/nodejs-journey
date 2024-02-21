import mongoose from "mongoose";
import Order from "./order.js";
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = async function (product) {
  const cartProductIndex = this.cart.items.findIndex(
    (item) => item.productId.toString() === product._id.toString()
  );
  const updatedCartItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    updatedCartItems[cartProductIndex].quantity += 1;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1,
    });
  }
  this.cart.items = updatedCartItems;
  await this.save();
};

userSchema.methods.getCart = async function () {
  const populatedUser = await this.populate("cart.items.productId");
  const products = populatedUser.cart.items.map((item) => ({
    product: { ...item.productId._doc },
    quantity: item.quantity,
  }));
  return products;
};

userSchema.methods.deleteItemFromCart = async function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  this.cart.items = updatedCartItems;
  await this.save();
};

userSchema.methods.clearCart = async function () {
  this.cart.items = [];
  await this.save();
};

userSchema.methods.createOrder = async function () {
  const cartProducts = await this.getCart();
  const order = new Order({
    user: {
      email: this.email,
      userId: this._id,
    },
    products: cartProducts,
  });
  await this.clearCart();
  await order.save();
  return order;
};

userSchema.methods.getOrders = async function () {
  const orders = await Order.find({ "user.userId": this._id });
  return orders;
};

const User = mongoose.model("User", userSchema);

export default User;
