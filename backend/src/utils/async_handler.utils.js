import { APIError } from "./api_error_handler.utils.js";

export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error("Async Handler Error:", error);
    if (error instanceof APIError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors || [],
        data: error.data || null,
        statusCode: error.statusCode,
      });
    }
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  });
