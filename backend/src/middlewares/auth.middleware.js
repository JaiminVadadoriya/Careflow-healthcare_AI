import jwt from 'jsonwebtoken';
import { APIError } from '../utils/api_error_handler.utils.js';
import { asyncHandler } from "../utils/async_handler.utils.js";

class AuthMiddleware {
  /**
   * Middleware to verify JWT token
   */
  authenticate = asyncHandler(async (req, res, next) => {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      throw new APIError(401, "Unauthorized: No token provided");
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      req.user = decoded;
      // Ensure _id is available for controllers expecting it (standardizing with MongoDB)
      if (req.user.id && !req.user._id) {
          req.user._id = req.user.id;
      }
      next();
    } catch (error) {
      throw new APIError(403, "Invalid or expired token");
    }
  });

  /**
   * Middleware to restrict access based on roles
   * @param {string[]} requiredRoles 
   */
  restrictTo(requiredRoles = []) {
    return (req, res, next) => {
      if (!req.user) {
         return res.status(401).json({ message: 'Unauthorized: User not authenticated' });
      }

      const { role } = req.user; 
      const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      
      if (!allowedRoles.includes(role) && role !== 'admin') {
        return res.status(403).json({ message: `Forbidden: You do not have access to this resource. Your role is ${role}` });
      }
      next();
    };
  }
}

export default new AuthMiddleware();
