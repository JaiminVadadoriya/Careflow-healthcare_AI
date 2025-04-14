import jwt from 'jsonwebtoken';
import { APIError } from '../utils/api_error_handler.utils.js';
import { asyncHandler } from "../utils/async_handler.utils.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken || req.headers["Authorization"]?.split(" ")[1]; // "Bearer token"

  if (!token) {
    throw new APIError(401, "Unauthorized: No token provided");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // Save decoded info to request object
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
});
