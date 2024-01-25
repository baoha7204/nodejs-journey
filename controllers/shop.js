import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const getIndex = async (req, res, next) => {
  const products = await Product.findAll();
  res.render("shop/index", {
    products,
    pageTitle: "Shop",
    path: "/",
  });
};

export const getProducts = async (req, res, next) => {
  const products = await Product.findAll();
  res.render("shop/product-list", {
    products,
    pageTitle: "Products",
    path: "/products",
  });
};

export const getProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findByPk(productId);
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
  const cart = await req.user.getCart();
  if (!cart) {
    return res.redirect("/");
  }
  const cartProducts = await cart.getProducts();
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

  const cart = await req.user.getCart();
  if (!cart) {
    return res.redirect("/");
  }

  const cartProducts = await cart.getProducts({ where: { id: productId } });
  if (!cartProducts) {
    return res.redirect("/");
  }

  let product;
  if (cartProducts.length > 0) {
    product = cartProducts[0];
  }

  let newQuantity = 1;
  if (product) {
    const oldQuantity = product.cartItem.quantity;
    newQuantity = oldQuantity + 1;
  }

  const selectedProduct = await Product.findByPk(productId);
  await cart.addProduct(selectedProduct, {
    through: { quantity: newQuantity },
  });

  res.redirect("/cart");
};

export const postDeleteCartItem = async (req, res, next) => {
  const { productId } = req.body;

  const cart = await req.user.getCart();
  if (!cart) {
    return res.redirect("/");
  }

  const cartProducts = await cart.getProducts({ where: { id: productId } });
  if (!cartProducts) {
    return res.redirect("/");
  }
  if (cartProducts.length === 0) {
    return res.redirect("/");
  }
  const product = cartProducts[0];
  await product.cartItem.destroy();
  res.redirect("/cart");
};

export const getOrders = async (req, res, next) => {
  const cart = await req.user.getCart();
  if (!cart) {
    return res.redirect("/");
  }

  const cartProducts = await cart.getProducts();
  if (!cartProducts) {
    return res.redirect("/");
  }

  const orders = await req.user.getOrders({ include: ["products"] });
  orders.forEach((order) => {
    order.products.forEach((product) => {
      console.log(product);
    });
  });
  if (!orders) {
    return res.redirect("/");
  }

  res.render("shop/orders", {
    pageTitle: "My Orders",
    path: "/orders",
    orders,
  });
};

export const postCreateOrder = async (req, res, next) => {
  const cart = await req.user.getCart();
  if (!cart) {
    return res.redirect("/");
  }
  const cartProducts = await cart.getProducts();
  if (!cartProducts) {
    return res.redirect("/");
  }
  const order = await req.user.createOrder();
  await order.addProducts(
    cartProducts.map((product) => {
      product.orderItem = { quantity: product.cartItem.quantity };
      return product;
    })
  );
  await cart.setProducts(null);
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
