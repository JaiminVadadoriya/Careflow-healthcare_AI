import jwt from 'jsonwebtoken';
import { APIError } from '../utils/api_error_handler.utils.js';
import { asyncHandler } from "../utils/async_handler.utils.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  let token = null;

  // ✅ First check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // ✅ Fallback: check cookie (for curl/Postman testing)
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new APIError(401, "Unauthorized: No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new APIError(403, "Invalid or expired token");
  }
});
