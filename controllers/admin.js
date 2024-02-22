import { validationResult } from "express-validator";
import Product from "../models/product.js";
import { extractFlashMessage } from "../utils/helpers.js";

export const getAddProduct = (req, res, next) => {
  const errorMessage = extractFlashMessage(req, "error");
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage,
    validationErrors: [],
    oldInput: req.oldInput,
  });
};

export const postAddProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: req.oldInput,
    });
  }
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title,
    price,
    imageUrl,
    description,
    userId: req.user,
  });
  await product.save();
  res.redirect("/admin/products");
};

export const getEditProduct = async (req, res, next) => {
  const errorMessage = extractFlashMessage(req, "error");
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const { productId } = req.params;
  const updatedProduct = await Product.findOne({
    _id: productId,
    userId: req.user._id,
  });
  if (!updatedProduct) {
    return res.redirect("/");
  }
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editing: Boolean(editMode),
    product: updatedProduct,
    errorMessage,
    validationErrors: [],
  });
};

export const postEditProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: Boolean(req.query.edit),
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: req.oldInput,
    });
  }
  const { productId, title, imageUrl, price, description } = req.body;
  const updatedProduct = await Product.findOne({
    _id: productId,
    userId: req.user._id,
  });
  if (!updatedProduct) {
    return res.redirect("/admin/products");
  }
  updatedProduct.title = title;
  updatedProduct.price = price;
  updatedProduct.imageUrl = imageUrl;
  updatedProduct.description = description;
  await updatedProduct.save();
  res.redirect("/admin/products");
};

export const getProducts = async (req, res, next) => {
  const products = await Product.find({ userId: req.user._id }).exec();
  res.render("admin/products", {
    products,
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
};

export const postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  await Product.deleteOne({ userId: req.user._id, _id: productId });
  res.redirect("/admin/products");
};

const adminController = {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  getProducts,
  postDeleteProduct,
};

export default adminController;
