import User from "../models/user.model.js"; // Import User model
import { APIError } from "../utils/api_error_handler.utils.js";
import ApiResponse from "../utils/api_response.utils.js";
import { asyncHandler } from "../utils/async_handler.utils.js";
import { generateAccessAndRefreshTokens } from "../utils/token.utils.js";

// Create a new user (with password hashing)
export const createUser = asyncHandler(async (req, res) => {
  const { full_name, email, password, role, phone, profile_photo, status } =
    req.body;
  // Validate required fields
  const requiredFields = { full_name, email, password, role };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value || value.trim() === "") {
      throw new ApiError(400, `${key.replace("_", " ")} is required`);
    }
  }

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new APIError(409, "Email is already taken");
  }

  // role = role?.trim().toLowerCase(); // Convert role to lowercase

  const user = await User.create({
    full_name,
    email,
    password,
    role,
    phone,
    profile_photo,
    status,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // Exclude password from the response

  if (!createdUser) {
    throw new APIError(500, "Something went wrong while creating the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, "User created successfully", createdUser));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find the user by email
  const user = await User.findOne({ email });

  // If the user doesn't exist, send an error
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Compare the entered password with the stored hashed password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(409, "Invalid password");
  }

  // Generate JWT token
  const { accesstoken, refreshToken } =
    await generateAccessAndRefreshTokens(user);

  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); // Exclude password from the response
  if (!loginUser) {
    throw new ApiError(500, "Something went wrong while logging in");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accesstoken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "Login successfully", {
        user: loginUser,
        accesstoken,
        refreshToken,
      })
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      $set: { refreshToken: null },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  // If the user doesn't exist, send an error
  if (!user) {
    throw new ApiError(401, "Access denied: User not found");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  // Clear the cookies

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "Logout successful"));
});

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Get all users from the database
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Refresh access token
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new APIError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?.id);

    if (!user) {
      throw new APIError(401, "Invalid refresh Token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new APIError(401, "Refresh Token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponce(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed!"
        )
      );
  } catch (error) {
    throw new APIError(401, error?.message || "Invalid refresh Token");
  }
});

// Change current user's password
export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new APIError(401, "Unauthorized request");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new APIError(400, "Invalid Old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponce(200, {}, "Password change successfully"));
});

// Get current user
export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponce(200, req.user, "Current user fetched successfully"));
});

// Update account details
export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new APIError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      fullName,
      email: email,
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponce(200, user, "Account details updated successfully"));
});

// 👨‍⚕️ Doctor Controller Methods
export const getAssignedPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({ assigned_doctor: req.user._id })
    .select("-password -refreshToken")
    .populate("medical_history", "diagnosis date_time");

  if (!patients.length) {
    throw new APIError(404, "No patients assigned to this doctor");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, patients, "Assigned patients retrieved"));
});

export const updateMedicalRecord = asyncHandler(async (req, res) => {
  const { diagnosis, treatment } = req.body;
  const { id } = req.params;

  if (!diagnosis || !treatment) {
    throw new APIError(400, "Diagnosis and treatment are required");
  }

  const medicalRecord = await MedicalRecord.findByIdAndUpdate(
    id,
    { diagnosis, treatment, doctor: req.user._id },
    { new: true, runValidators: true }
  ).populate("patient", "full_name");

  if (!medicalRecord) {
    throw new APIError(404, "Medical record not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, medicalRecord, "Medical record updated"));
});

export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ doctor: req.user._id })
    .populate("patient", "full_name contact_info.phone")
    .sort({ date_time: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, appointments, "Appointments retrieved"));
});

// 👩‍⚕️ Nurse Controller Methods
export const addPatientVitals = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { blood_pressure, heart_rate, temperature, oxygen_saturation } = req.body;

  const vitalSigns = {
    blood_pressure,
    heart_rate,
    temperature,
    oxygen_saturation,
    recorded_by: req.user._id
  };

  const medicalRecord = await MedicalRecord.create({
    patient: patientId,
    doctor: req.user._id,
    diagnosis: "Vital Signs Check",
    treatment: JSON.stringify(vitalSigns)
  });

  return res
    .status(201)
    .json(new ApiResponse(201, medicalRecord, "Vitals recorded successfully"));
});

export const assignOrReleaseBed = asyncHandler(async (req, res) => {
  const { bedId, patientId, action } = req.body;

  const bed = await Bed.findById(bedId);
  if (!bed) throw new APIError(404, "Bed not found");

  if (action === "assign") {
    if (bed.is_occupied) throw new APIError(400, "Bed already occupied");
    
    bed.assigned_patient = patientId;
    bed.is_occupied = true;
  } else if (action === "release") {
    if (!bed.is_occupied) throw new APIError(400, "Bed is already unoccupied");
    
    bed.assigned_patient = null;
    bed.is_occupied = false;
  } else {
    throw new APIError(400, "Invalid action. Use 'assign' or 'release'");
  }

  await bed.save();
  return res
    .status(200)
    .json(new ApiResponse(200, bed, `Bed ${action}ed successfully`));
});

export const getNursePatientById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const patient = await Patient.findById(id)
    .select("-password -refreshToken")
    .populate("assigned_doctor", "full_name role")
    .populate("medical_history", "diagnosis date_time");

  if (!patient) throw new APIError(404, "Patient not found");

  return res
    .status(200)
    .json(new ApiResponse(200, patient, "Patient details retrieved"));
});

// 💁 Receptionist Controller Methods
export const receptionistRegisterPatient = asyncHandler(async (req, res) => {
  const { full_name, dob, gender, contact_info, emergency_contact } = req.body;

  const existingPatient = await Patient.findOne({ "contact_info.phone": contact_info.phone });
  if (existingPatient) {
    throw new APIError(409, "Patient with this phone number already exists");
  }

  const patient = await Patient.create({
    full_name,
    dob,
    gender,
    contact_info,
    emergency_contact,
    password: "defaultPassword123" // Should implement password reset flow
  });

  return res
    .status(201)
    .json(new ApiResponse(201, patient, "Patient registered successfully"));
});

export const receptionistBookAppointment = asyncHandler(async (req, res) => {
  const { patientId, doctorId, date_time, reason } = req.body;

  const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    date_time: { $gte: new Date(date_time) }
  });

  if (existingAppointment) {
    throw new APIError(409, "Doctor has overlapping appointment");
  }

  const appointment = await Appointment.create({
    patient: patientId,
    doctor: doctorId,
    date_time,
    reason
  });

  return res
    .status(201)
    .json(new ApiResponse(201, appointment, "Appointment booked successfully"));
});

export const receptionistCheckInPatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;

  const patient = await Patient.findByIdAndUpdate(
    patientId,
    { admission_date: new Date(), current_status: "admitted" },
    { new: true }
  ).select("-password -refreshToken");

  if (!patient) throw new APIError(404, "Patient not found");

  return res
    .status(200)
    .json(new ApiResponse(200, patient, "Patient checked in successfully"));
});