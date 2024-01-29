import { ObjectId } from "mongodb";
import { getDb } from "../utils/database.js";

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart;
    this._id = id ? new ObjectId(id) : null;
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    return getDb()
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );
    return getDb()
      .collection("users")
      .updateOne(
        { _id: this._id },
        { $set: { cart: { items: updatedCartItems } } }
      );
  }

  async createOrder() {
    const products = await this.getCart();
    const order = {
      items: products,
      user: {
        _id: this._id,
        username: this.username,
      },
    };
    await getDb().collection("orders").insertOne(order);
    this.cart = { items: [] };
    return getDb()
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
  }

  getOrders() {
    return getDb()
      .collection("orders")
      .find({ "user._id": this._id })
      .toArray();
  }

  async getCart() {
    const productIds = this.cart.items.map((i) => i.productId);
    const products = await getDb()
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();
    return products.map((p) => {
      const quantity = this.cart.items.find(
        (i) => i.productId.toString() === p._id.toString()
      ).quantity;
      return {
        ...p,
        quantity,
      };
    });
  }

  save() {
    return getDb().collection("users").insertOne(this);
  }

  static findById(id) {
    return getDb()
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
  }
}

export default User;
