import express from "express";
import adminController from "../controllers/admin.js";
import { asyncHandler } from "../utils/helpers.js";
import { isAuth } from "../middlewares/is-auth.js";

const adminRouter = express.Router();

// /admin/add-product GET
adminRouter.get(
  "/add-product",
  isAuth,
  asyncHandler(adminController.getAddProduct)
);

// /admin/products GET
adminRouter.get("/products", isAuth, asyncHandler(adminController.getProducts));

// /admin/add-product POST
adminRouter.post(
  "/add-product",
  isAuth,
  asyncHandler(adminController.postAddProduct)
);

// /admin/edit-product/:productId GET
adminRouter.get(
  "/edit-product/:productId",
  isAuth,
  asyncHandler(adminController.getEditProduct)
);

// /admin/edit-product POST
adminRouter.post(
  "/edit-product",
  isAuth,
  asyncHandler(adminController.postEditProduct)
);

// /admin/delete-product POST
adminRouter.post(
  "/delete-product",
  isAuth,
  asyncHandler(adminController.postDeleteProduct)
);

export default adminRouter;
