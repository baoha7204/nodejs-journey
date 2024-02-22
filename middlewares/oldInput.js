import sanitizer from "sanitizer";

function initOldInputInSession(req, name) {
  if (!req.session.oldInput.hasOwnProperty(name)) {
    req.session.oldInput[name] = {
      value: "",
      error: "",
    };
  }
}

export function oldInput(req, res, next) {
  if (!req.session) {
    return;
  }
  req.oldInput = {
    setError: function (name, error) {
      if (name) {
        initOldInputInSession(req, name);
        req.session.oldInput[name].error = error;
      }
    },
    value: function (name) {
      if (Object.prototype.hasOwnProperty.call(this, name)) {
        return this[name].value || "";
      }
    },

    error: function (name) {
      if (Object.prototype.hasOwnProperty.call(this, name)) {
        return this[name].error || "";
      }
    },
  };
  req.session.oldInput = {};
  if (req.method === "POST") {
    for (const name in req.body) {
      if (Object.prototype.hasOwnProperty.call(req.body, name)) {
        initOldInputInSession(req, name);
        req.session.oldInput[name].value = sanitizer.sanitize(req.body[name]);
      }
    }
  }
  if (req.session.oldInput) {
    for (const name in req.session.oldInput) {
      req.oldInput[name] = {
        value: req.session.oldInput[name].value,
        error: req.session.oldInput[name].error,
      };
    }
  }

  next();
}
