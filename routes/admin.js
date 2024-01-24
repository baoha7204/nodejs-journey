import express from "express";
import adminController from "../controllers/admin.js";
import { asyncHandler } from "../utils/helpers.js";

const adminRouter = express.Router();

// /admin/add-product GET
adminRouter.get("/add-product", asyncHandler(adminController.getAddProduct));

// /admin/products GET
adminRouter.get("/products", asyncHandler(adminController.getProducts));

// /admin/add-product POST
adminRouter.post("/add-product", asyncHandler(adminController.postAddProduct));

// /admin/edit-product/:productId GET
adminRouter.get(
  "/edit-product/:productId",
  asyncHandler(adminController.getEditProduct)
);

// /admin/edit-product POST
adminRouter.post(
  "/edit-product",
  asyncHandler(adminController.postEditProduct)
);

// /admin/delete-product POST
adminRouter.post(
  "/delete-product",
  asyncHandler(adminController.postDeleteProduct)
);

export default adminRouter;
