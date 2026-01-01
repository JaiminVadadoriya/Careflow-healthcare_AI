import User from "../models/user.model.js";
import { APIError } from "../utils/api_error_handler.utils.js";
import { generateAccessAndRefreshTokens } from "../utils/token.utils.js";
import jwt from "jsonwebtoken";

class AuthService {
  async registerUser(userData) {
    const { full_name, email, password, role, phone, profile_photo, status } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new APIError(409, "Email is already taken");
    }

    const user = await User.create({
      full_name,
      email,
      password,
      role,
      phone,
      profile_photo,
      status,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
      throw new APIError(500, "Something went wrong while creating the user");
    }

    return createdUser;
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new APIError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new APIError(409, "Invalid password");
    }

    const { accesstoken, refreshToken } = await generateAccessAndRefreshTokens(user);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return { user: loggedInUser, accesstoken, refreshToken };
  }

  async logoutUser(userId) {
    await User.findByIdAndUpdate(
      userId,
      { $set: { refreshToken: null } },
      { new: true, runValidators: true }
    );
  }

  async refreshAccessToken(incomingRefreshToken) {
    try {
      const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findById(decodedToken?.id);

      if (!user) throw new APIError(401, "Invalid refresh Token");
      if (incomingRefreshToken !== user.refreshToken) throw new APIError(401, "Refresh Token is expired or used");

      return await generateAccessAndRefreshTokens(user);
    } catch (error) {
      throw new APIError(401, error?.message || "Invalid refresh Token");
    }
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId);
    if (!user) throw new APIError(401, "Unauthorized request");

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) throw new APIError(400, "Invalid Old Password");

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
  }
}

export default new AuthService();
