import path from "path";

export const rootPath = (...paths) => {
  return path.join(process.cwd(), ...paths);
};

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const extractFlashMessage = (req, type) => {
  let message = req.flash(type);
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  return message;
};
