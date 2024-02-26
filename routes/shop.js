import express from "express";
import shopController from "../controllers/shop.js";
import { asyncHandler } from "../utils/helpers.js";
import { isAuth } from "../middlewares/is-auth.js";

const shopRouter = express.Router();

shopRouter.get("/", asyncHandler(shopController.getIndex));

shopRouter.get("/products", asyncHandler(shopController.getProducts));

shopRouter.get("/products/:productId", asyncHandler(shopController.getProduct));

shopRouter.get("/cart", isAuth, asyncHandler(shopController.getCart));

shopRouter.post("/cart", isAuth, asyncHandler(shopController.postCart));

shopRouter.post(
  "/cart-delete-item",
  isAuth,
  asyncHandler(shopController.postDeleteCartItem)
);

shopRouter.get("/orders", isAuth, asyncHandler(shopController.getOrders));

shopRouter.post(
  "/create-order",
  isAuth,
  asyncHandler(shopController.postCreateOrder)
);

shopRouter.get(
  "/orders/:orderId",
  isAuth,
  asyncHandler(shopController.getInvoice)
);

export default shopRouter;
