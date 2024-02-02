import csurf from "csurf";

export const csrfProtection = csurf();

export const csrfToken = (req, res, next) => {
  res.locals.user = req.user;
  res.locals.csrfToken = req.csrfToken();
  next();
};
