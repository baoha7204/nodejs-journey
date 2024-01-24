import Cart from "../models/cart.js";
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
  const productId = req.params.productId;
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

export const getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    if (!cart) {
      return res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: [],
      });
    }
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (const product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({
            ...product,
            qty: cartProductData.qty,
          });
        }
      }
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

export const postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect("/cart");
};

export const postDeleteCartItem = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
  });
  res.redirect("/cart");
};

export const getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "My Orders",
    path: "/orders",
  });
};

export const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

const shopController = {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  postCart,
  postDeleteCartItem,
  getOrders,
  getCheckout,
};

export default shopController;
