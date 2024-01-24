import path from "path";

export const rootPath = (...paths) => {
  return path.join(process.cwd(), ...paths);
};
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
