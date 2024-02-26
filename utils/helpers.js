import path from "path";
import fs from "fs";

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

export const toArrayBuffer = (buffer) => {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
};

export const deleteFile = (filePath, next) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      next(err);
    }
  });
};
