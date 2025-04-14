export const generateAccessAndRefreshTokens = async (user) => {
    try {
      // const user = await User.findById(userId);
      console.log("User found:", user.generateAccessToken());
      const accesstoken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      // Save the refresh token in the database
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accesstoken, refreshToken };
    } catch (error) {
      throw new ApiError(500, "Error while generating tokens");
    }
  };