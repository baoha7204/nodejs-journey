import { body } from "express-validator";

export const productValidation = [
  body("title", "Title must 3-100 characters long!")
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 }),
  body("imageUrl", "Image URL is not valid!").isURL(),
  body("price", "Price format is not valid!").isFloat(),
  body("description", "Description must 5-400 characters long!")
    .trim()
    .isLength({ min: 5, max: 400 }),
];
