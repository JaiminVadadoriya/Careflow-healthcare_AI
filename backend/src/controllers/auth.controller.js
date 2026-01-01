import AuthService from "../services/auth.service.js";
import ApiResponse from "../utils/api_response.utils.js";
import { asyncHandler } from "../utils/async_handler.utils.js";
import { APIError } from "../utils/api_error_handler.utils.js";

class AuthController {
  register = asyncHandler(async (req, res) => {
    const { full_name, email, password, role } = req.body;
    if (!full_name || !email || !password || !role) {
      throw new APIError(400, "All fields are required");
    }

    const user = await AuthService.registerUser(req.body);
    return res.status(201).json(new ApiResponse(200, "User created successfully", user));
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new APIError(400, "Email and password are required");
    }

    const { user, accesstoken, refreshToken } = await AuthService.loginUser(email, password);

    const options = { httpOnly: true, secure: true };
    return res
      .status(200)
      .cookie("accessToken", accesstoken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, "Login successfully", {
          user,
          accesstoken,
          refreshToken,
        })
      );
  });

  logout = asyncHandler(async (req, res) => {
    await AuthService.logoutUser(req.user.id);
    const options = { httpOnly: true, secure: true };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, "Logout successful"));
  });

  refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new APIError(401, "unauthorized request");
    }

    const { accessToken, refreshToken } = await AuthService.refreshAccessToken(incomingRefreshToken);
    const options = { httpOnly: true, secure: true };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed!"
        )
      );
  });

  changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    await AuthService.changePassword(req.user._id, oldPassword, newPassword);
    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
  });
}

export default new AuthController();
