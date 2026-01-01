import User from "../models/user.model.js";
import { APIError } from "../utils/api_error_handler.utils.js";

class UserService {
  async getAllUsers() {
    return await User.find().select("-password -refreshToken");
  }

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new APIError(404, "User not found");
    return user;
  }

  async getUserById(userId) {
    return await User.findById(userId).select("-password -refreshToken");
  }

  async updateUserDetails(userId, { full_name, email }) {
    const user = await User.findByIdAndUpdate(
      userId,
      { full_name, email },
      { new: true }
    ).select("-password");

    if (!user) throw new APIError(404, "User not found");
    return user;
  }

  async updateUserStatus(userId, status) {
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select("-password");

    if (!user) throw new APIError(404, "User not found");
    return user;
  }

  async updateUserRole(userId, role) {
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) throw new APIError(404, "User not found");
    return user;
  }
}

export default new UserService();
