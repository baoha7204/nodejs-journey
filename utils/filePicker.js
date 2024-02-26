import multer from "multer";
import slugify from "slugify";

export const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tmp/images");
  },
  filename: (req, file, cb) => {
    const slug = slugify(
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname,
      { lower: true }
    );
    cb(null, slug);
  },
});

export const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
