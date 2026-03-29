import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("❌ VALIDATION ERROR =>", errors.array()); // 🔥 Added Log
    return res.badRequest("Validation Error", errors.array());
  }

  next();
};
