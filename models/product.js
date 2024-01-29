import { ObjectId } from "mongodb";
import { getDb } from "../utils/database.js";

class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? new ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const productsCollection = getDb().collection("products");
    if (this._id) {
      return productsCollection.updateOne({ _id: this._id }, { $set: this });
    }
    return productsCollection.insertOne(this);
  }

  static fetchAll() {
    return getDb().collection("products").find().toArray();
  }

  static findById(id) {
    return getDb()
      .collection("products")
      .find({ _id: new ObjectId(id) })
      .next();
  }

  static deleteById(id) {
    return getDb()
      .collection("products")
      .deleteOne({ _id: new ObjectId(id) });
  }
}

export default Product;
