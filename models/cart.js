import fs from "fs";
import { rootPath } from "../utils/helpers.js";

export default class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(rootPath("data", "cart.json"), (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += +productPrice;
      fs.writeFile(
        rootPath("data", "cart.json"),
        Buffer.from(JSON.stringify(cart)),
        (err) => {
          console.log(err);
        }
      );
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(rootPath("data", "cart.json"), (err, fileContent) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(fileContent) };
      const product = updatedCart.products.find((prod) => prod.id === id);
      if (!product) {
        return;
      }
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice -= productPrice * product.qty;
      fs.writeFile(
        rootPath("data", "cart.json"),
        Buffer.from(JSON.stringify(updatedCart)),
        (err) => {
          console.log(err);
        }
      );
    });
  }

  static getCart(cb) {
    fs.readFile(rootPath("data", "cart.json"), (err, fileContent) => {
      if (err) {
        cb(null);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  }
}
