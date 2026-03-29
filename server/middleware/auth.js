import jwt from "jsonwebtoken";
import Doctor from "../model/Doctor.js";
import Patient from "../model/Patient.js";
import Admin from "../model/Admin.js";

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.unauthorized("missing token");

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.auth = decode;

    if (decode.type === "doctor") {
      req.user = await Doctor.findById(decode.id);
    } else if (decode.type === "patient") {
      req.user = await Patient.findById(decode.id);
    } else if (decode.type === "admin") {
      req.user = await Admin.findById(decode.id);
    }

    if (!req.user) return res.unauthorized("Invalid user");
    next();
  } catch (error) {
    return res.unauthorized("Invalid or expire token");
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.auth || req.auth.type !== role) {
    return res.forbidden("Insufficient role permissions");
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  try {
    // check authentication
    if (!req.auth) {
      return res.forbidden("Authentication required");
    }

    // check role
    if (req.auth.type !== "admin") {
      return res.forbidden("Admin access required");
    }

    // check active account
    if (!req.user.isActive) {
      return res.forbidden("Inactive account");
    }

    next();
  } catch (error) {
    return res.serverError("Authorization failed", [error.message]);
  }
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (
      !req.user ||
      !req.user.permissions ||
      !req.user.permissions[permission]
    ) {
      return res.forbidden(`Permission required: ${permission}`);
    }

    next();
  };
};
