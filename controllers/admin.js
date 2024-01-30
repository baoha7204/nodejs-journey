import Product from "../models/product.js";

export const getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

export const postAddProduct = async (req, res, next) => {
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
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const { productId } = req.params;
  const product = await Product.findById(productId).exec();
  if (!product) {
    return res.redirect("/");
  }
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editing: Boolean(editMode),
    product,
  });
};

export const postEditProduct = async (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  const updatedProduct = await Product.findById(productId).exec();
  updatedProduct.title = title;
  updatedProduct.price = price;
  updatedProduct.imageUrl = imageUrl;
  updatedProduct.description = description;
  await updatedProduct.save();
  res.redirect("/admin/products");
};

export const getProducts = async (req, res, next) => {
  const products = await Product.find().exec();
  res.render("admin/products", {
    products,
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
};

export const postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  await Product.findByIdAndDelete(productId);
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
