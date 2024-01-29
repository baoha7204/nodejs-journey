import Product from "../models/product.js";

export const getIndex = async (req, res, next) => {
  const products = await Product.fetchAll();
  res.render("shop/index", {
    products,
    pageTitle: "Shop",
    path: "/",
  });
};

export const getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();
  res.render("shop/product-list", {
    products,
    pageTitle: "Products",
    path: "/products",
  });
};

export const getProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId.toString());
  console.log(product);
  if (!product) {
    return res.redirect("/products");
  }
  res.render("shop/product-detail", {
    product,
    pageTitle: product.title,
    path: "/products",
  });
};

export const getCart = async (req, res, next) => {
  const cartProducts = await req.user.getCart();
  if (!cartProducts) {
    return res.redirect("/");
  }
  res.render("shop/cart", {
    pageTitle: "Cart",
    path: "/cart",
    products: cartProducts,
  });
};

export const postCart = async (req, res, next) => {
  const { productId } = req.body;
  const user = req.user;
  const selectedProduct = await Product.findById(productId.toString());
  if (!selectedProduct) {
    return res.redirect("/");
  }
  await user.addToCart(selectedProduct);
  res.redirect("/cart");
};

export const postDeleteCartItem = async (req, res, next) => {
  const { productId } = req.body;
  const user = req.user;
  await user.deleteItemFromCart(productId);
  res.redirect("/cart");
};

export const getOrders = async (req, res, next) => {
  const orders = await req.user.getOrders();

  res.render("shop/orders", {
    pageTitle: "My Orders",
    path: "/orders",
    orders,
  });
};

export const postCreateOrder = async (req, res, next) => {
  await req.user.createOrder();
  res.redirect("/orders");
};

const shopController = {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postDeleteCartItem,
  getOrders,
  postCreateOrder,
};

export default shopController;
