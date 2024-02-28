import { validationResult } from "express-validator";
import fs from "fs";
import { S3 } from "@aws-sdk/client-s3";
import Product from "../models/product.js";
import {
  deleteFile,
  extractFlashMessage,
  rootPath,
  toArrayBuffer,
} from "../utils/helpers.js";

const s3 = new S3({
  region: "ap-southeast-1",
});

export const getAddProduct = (req, res, next) => {
  const errorMessage = extractFlashMessage(req, "error");
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage,
    validationErrors: [],
    oldInput: req.oldInput,
  });
};

export const postAddProduct = async (req, res, next) => {
  const errors = validationResult(req);
  const imageFile = req.file;
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: req.oldInput,
    });
  }
  if (!imageFile) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: "Attached file is not an image.",
      validationErrors: [],
      oldInput: req.oldInput,
    });
  }
  const title = req.body.title;

  // upload image to s3
  const slug = imageFile.filename;
  const img = fs.readFileSync(imageFile.path);
  const bufferedImage = toArrayBuffer(img);
  s3.putObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: slug,
    Body: Buffer.from(bufferedImage),
    ContentType: imageFile.mimetype,
  });

  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title,
    price,
    imageUrl: `${process.env.AWS_IMAGE_STORAGE_URL}/${slug}`,
    description,
    userId: req.user,
  });
  await product.save();
  res.redirect("/admin/products");
};

export const getEditProduct = async (req, res, next) => {
  const errorMessage = extractFlashMessage(req, "error");
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const { productId } = req.params;
  const updatedProduct = await Product.findOne({
    _id: productId,
    userId: req.user._id,
  });
  if (!updatedProduct) {
    return res.redirect("/");
  }
  res.render("admin/edit-product", {
    pageTitle: "Edit Product",
    path: "/admin/edit-product",
    editing: Boolean(editMode),
    product: updatedProduct,
    errorMessage,
    validationErrors: [],
  });
};

export const postEditProduct = async (req, res, next) => {
  const errors = validationResult(req);
  const imageFile = req.file;
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: Boolean(req.query.edit),
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: req.oldInput,
    });
  }
  const { productId, title, price, description } = req.body;
  const updatedProduct = await Product.findOne({
    _id: productId,
    userId: req.user._id,
  });
  if (!updatedProduct) {
    return res.redirect("/admin/products");
  }
  if (imageFile) {
    // delete old image from s3 and tmp folder
    const oldImage = updatedProduct.imageUrl.split(
      `${process.env.AWS_IMAGE_STORAGE_URL}/`
    )[1];
    deleteFile(rootPath("tmp", "images", oldImage), next);
    s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: oldImage,
    });
    // upload image to s3
    const slug = imageFile.filename;
    const img = fs.readFileSync(imageFile.path);
    const bufferedImage = toArrayBuffer(img);
    s3.putObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: slug,
      Body: Buffer.from(bufferedImage),
      ContentType: imageFile.mimetype,
    });
    updatedProduct.imageUrl = `${process.env.AWS_IMAGE_STORAGE_URL}/${slug}`;
  }
  updatedProduct.title = title;
  updatedProduct.price = price;
  updatedProduct.description = description;
  await updatedProduct.save();
  res.redirect("/admin/products");
};

export const getProducts = async (req, res, next) => {
  const products = await Product.find({ userId: req.user._id }).exec();
  res.render("admin/products", {
    products,
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
};

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) {
    return res.redirect("/admin/products");
  }
  // delete image from s3 and tmp folder
  const oldImage = product.imageUrl.split(
    `${process.env.AWS_IMAGE_STORAGE_URL}/`
  )[1];
  deleteFile(rootPath("tmp", "images", oldImage), next);
  s3.deleteObject({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: oldImage,
  });
  await Product.deleteOne({ userId: req.user._id, _id: productId });
  res.status(200).json({ message: "Successfully delete!" });
};

export default {
  getAddProduct,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  getProducts,
  deleteProduct,
};
