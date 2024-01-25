import express from "express";
import shopController from "../controllers/shop.js";
import { asyncHandler } from "../utils/helpers.js";

const shopRouter = express.Router();

shopRouter.get("/", asyncHandler(shopController.getIndex));

shopRouter.get("/products", asyncHandler(shopController.getProducts));

shopRouter.get("/products/:productId", asyncHandler(shopController.getProduct));

shopRouter.get("/cart", asyncHandler(shopController.getCart));

shopRouter.post("/cart", asyncHandler(shopController.postCart));

shopRouter.post(
  "/cart-delete-item",
  asyncHandler(shopController.postDeleteCartItem)
);

shopRouter.get("/orders", asyncHandler(shopController.getOrders));

shopRouter.post("/create-order", asyncHandler(shopController.postCreateOrder));

shopRouter.get("/checkout", asyncHandler(shopController.getCheckout));

export default shopRouter;
