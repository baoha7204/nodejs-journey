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
  await req.user.createProduct({ title, price, imageUrl, description });
  res.redirect("/admin/products");
};

export const getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const { productId } = req.params;
  const product = await Product.findByPk(productId);
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
  const { productId } = req.body;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = await Product.findByPk(productId);
  if (!product) {
    return res.redirect("/");
  }
  await product.update({ title, imageUrl, price, description });
  res.redirect("/admin/products");
};

export const getProducts = async (req, res, next) => {
  const products = await req.user.getProducts();
  res.render("admin/products", {
    products,
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
};

export const postDeleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findByPk(productId);
  if (!product) {
    return res.redirect("/");
  }
  await product.destroy();
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
