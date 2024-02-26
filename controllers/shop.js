import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import Order from "../models/order.js";
import Product from "../models/product.js";

export const getIndex = async (req, res, next) => {
  const products = await Product.find().exec();
  res.render("shop/index", {
    products,
    pageTitle: "Shop",
    path: "/",
  });
};

export const getProducts = async (req, res, next) => {
  const products = await Product.find().exec();
  res.render("shop/product-list", {
    products,
    pageTitle: "Products",
    path: "/products",
  });
};

export const getProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
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
  const selectedProduct = await Product.findById(productId);
  if (!selectedProduct) {
    return res.redirect("/");
  }
  await req.user.addToCart(selectedProduct);
  res.redirect("/cart");
};

export const postDeleteCartItem = async (req, res, next) => {
  const { productId } = req.body;
  await req.user.deleteItemFromCart(productId);
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

export const getInvoice = async (req, res, next) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new Error("No order found."));
  }
  if (order.user.userId.toString() !== req.user._id.toString()) {
    return next(new Error("Unauthorized"));
  }
  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join("tmp", "invoices", invoiceName);
  const pdfDoc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);
  pdfDoc.fontSize(26).text("Invoice", {
    underline: true,
  });
  let totalPrice = 0;
  order.products.forEach((prod) => {
    totalPrice += prod.quantity * prod.product.price;
    pdfDoc
      .fontSize(14)
      .text(
        `${prod.product.title} - ${prod.quantity} x $${prod.product.price}`
      );
  });
  pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`);
  pdfDoc.end();
};
export default {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postDeleteCartItem,
  getOrders,
  postCreateOrder,
  getInvoice,
};
