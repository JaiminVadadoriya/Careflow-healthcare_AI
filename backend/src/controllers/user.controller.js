import UserService from "../services/user.service.js";
import ApiResponse from "../utils/api_response.utils.js";
import { asyncHandler } from "../utils/async_handler.utils.js";
import { APIError } from "../utils/api_error_handler.utils.js";

class UserController {
  getUsers = asyncHandler(async (req, res) => {
    const users = await UserService.getAllUsers();
    return res.status(200).json(new ApiResponse(200, "Users retrieved successfully", users));
  });

  deleteUser = asyncHandler(async (req, res) => {
    await UserService.deleteUser(req.params.id);
    return res.status(200).json(new ApiResponse(200, "User deleted successfully", {}));
  });

  getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully"));
  });

  updateUserDetails = asyncHandler(async (req, res) => {
    const { full_name, email } = req.body;
    if (!full_name || !email) {
      throw new APIError(400, "Full name and email are required");
    }
    const user = await UserService.updateUserDetails(req.params.id, { full_name, email });
    return res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
  });

  updateUserStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!["active", "inactive"].includes(status)) {
      throw new APIError(400, "Invalid status value");
    }
    const user = await UserService.updateUserStatus(req.params.id, status);
    return res.status(200).json(new ApiResponse(200, user, `User status updated to ${status}`));
  });

  updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    if (!["admin", "doctor", "nurse", "receptionist"].includes(role)) {
      throw new APIError(400, "Invalid role value");
    }
    const user = await UserService.updateUserRole(req.params.id, role);
    return res.status(200).json(new ApiResponse(200, user, `User role updated to ${role}`));
  });

  updateAccountDetails = asyncHandler(async (req, res) => {
     const { fullName, email } = req.body;
     if (!fullName || !email) {
       throw new APIError(400, "All fields are required");
     }
     // Note: Using req.user._id here as it's for the logged in user
     const user = await UserService.updateUserDetails(req.user._id, { full_name: fullName, email });
     return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
  });
}

export default new UserController();
