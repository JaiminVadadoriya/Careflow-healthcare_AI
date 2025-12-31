import User from "../models/user.model.js"; // Import User model
import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import Inventory from "../models/inventory.model.js";
import Bed from "../models/bed.model.js";
import MedicalRecord from "../models/medical_record.model.js";
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
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken"); // ✅ Exclude sensitive fields
  return res
    .status(200)
    .json(new ApiResponse(200, "Users retrieved successfully", users));
});

// Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new APIError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully", {}));
});

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

export const updateUserDetails = asyncHandler(async (req, res) => {
  const { full_name, email } = req.body;
  const userId = req.params.id;

  if (!full_name || !email) {
    throw new APIError(400, "Full name and email are required");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { full_name, email },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new APIError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, user, "User updated successfully"));
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const userId = req.params.id;

  if (!["active", "inactive"].includes(status)) {
    throw new APIError(400, "Invalid status value");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new APIError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, user, `User status updated to ${status}`));
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;

  if (!["admin", "doctor", "nurse", "receptionist"].includes(role)) {
    throw new APIError(400, "Invalid role value");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new APIError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponce(200, user, `User role updated to ${role}`));
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
    .json(new ApiResponse(200, "Assigned patients retrieved", patients));
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
    .json(new ApiResponse(200, "Medical record updated", medicalRecord));
});

export const getDoctorAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ doctor: req.user._id })
    .populate("patient", "full_name contact_info.phone")
    .sort({ date_time: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, "Appointments retrieved", appointments));
});

// 👩‍⚕️ Nurse Controller Methods
export const addPatientVitals = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const { blood_pressure, heart_rate, temperature, oxygen_saturation } =
    req.body;

  const vitalSigns = {
    blood_pressure,
    heart_rate,
    temperature,
    oxygen_saturation,
    recorded_by: req.user._id,
  };

  const medicalRecord = await MedicalRecord.create({
    patient: patientId,
    doctor: req.user._id,
    diagnosis: "Vital Signs Check",
    treatment: JSON.stringify(vitalSigns),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Vitals recorded successfully", medicalRecord));
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
    .json(new ApiResponse(200, `Bed ${action}ed successfully`, bed));
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
    .json(new ApiResponse(200, "Patient details retrieved", patient));
});

// 💁 Receptionist Controller Methods
export const receptionistRegisterPatient = asyncHandler(async (req, res) => {
  const {
    full_name,
    dob,
    gender,
    contact_info,
    emergency_contact,
    assigned_doctor,
  } = req.body;

  const existingPatient = await Patient.findOne({
    "contact_info.phone": contact_info.phone,
  });
  if (existingPatient) {
    throw new APIError(409, "Patient with this phone number already exists");
  }

  const patient = await Patient.create({
    full_name,
    dob,
    gender,
    contact_info,
    emergency_contact,
    password: "Password123", // Should implement password reset flow
    assigned_doctor,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Patient registered successfully", patient));
});


export const receptionistAllRegisterPatient = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('assigned_doctor', 'full_name email') // get doctor info
      .select('-password -refreshToken'); // remove sensitive data

    res.status(200).json({ success: true, data: patients });
  } catch (error) {
    console.error('Error fetching patients for receptionist:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const receptionistBookAppointment = asyncHandler(async (req, res) => {
  const { patientId, doctorId, date_time, reason } = req.body;

  const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    date_time: { $gte: new Date(date_time) },
  });

  if (existingAppointment) {
    throw new APIError(409, "Doctor has overlapping appointment");
  }

  const appointment = await Appointment.create({
    patient: patientId,
    doctor: doctorId,
    date_time,
    reason,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Appointment booked successfully", appointment));
});

export const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: "doctor" }).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Doctors retrieved successfully", doctors));
});

export const getAllPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find()
    .populate("assigned_doctor", "full_name") // populate doctor's name
    .select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(200, "Patients retrieved successfully", patients));
});

export const getNurseAssignedPatients = asyncHandler(async (req, res) => {
  const patients = await Patient.find({ assigned_nurse: req.user._id })
    .select("-password -refreshToken")
    .populate("assigned_doctor", "full_name")
    .populate("medical_history", "diagnosis date_time");
  return res.status(200).json(new ApiResponse(200, "Assigned patients retrieved", patients));
});

export const receptionistUpdateAppointment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, date_time } = req.body;
  const update = {};
  if (status) update.status = status;
  if (date_time) update.date_time = date_time;
  const appointment = await Appointment.findByIdAndUpdate(id, update, {
    new: true,
  });
  if (!appointment) throw new APIError(404, "Appointment not found");
  return res
    .status(200)
    .json(new ApiResponse(200, "Appointment updated", appointment));
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
    .json(new ApiResponse(200, "Patient checked in successfully", patient));
});

export const receptionistDischargePatient = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  const patient = await Patient.findByIdAndUpdate(
    patientId,
    { current_status: "discharged", discharge_date: new Date() },
    { new: true }
  ).select("-password -refreshToken");
  if (!patient) throw new APIError(404, "Patient not found");
  return res
    .status(200)
    .json(new ApiResponse(200, "Patient discharged successfully", patient));
});

// 📊 Admin Report Functions
export const getDashboardReports = asyncHandler(async (req, res) => {
  const [userCount, appointmentCount, inventoryCount, bedCount] =
    await Promise.all([
      User.countDocuments(),
      Appointment.countDocuments(),
      Inventory.countDocuments(),
      Bed.countDocuments({ is_occupied: true }),
    ]);

  const dashboardData = {
    totalUsers: userCount,
    totalAppointments: appointmentCount,
    totalInventoryItems: inventoryCount,
    occupiedBeds: bedCount,
    recentActivity: [
      { type: "user", text: `${userCount} total users`, time: new Date() },
      {
        type: "appointment",
        text: `${appointmentCount} total appointments`,
        time: new Date(),
      },
      {
        type: "inventory",
        text: `${inventoryCount} inventory items`,
        time: new Date(),
      },
      { type: "bed", text: `${bedCount} beds occupied`, time: new Date() },
    ],
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Dashboard reports retrieved successfully",
        dashboardData
      )
    );
});

export const getUserReports = asyncHandler(async (req, res) => {
  const { startDate, endDate, role } = req.query;

  let query = {};
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  if (role) {
    query.role = role;
  }

  const users = await User.find(query).select("-password -refreshToken");
  const roleStats = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  const reportData = {
    users,
    totalUsers: users.length,
    roleDistribution: roleStats,
    dateRange: { startDate, endDate },
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, "User reports retrieved successfully", reportData)
    );
});

export const getAppointmentReports = asyncHandler(async (req, res) => {
  const { startDate, endDate, status } = req.query;

  let query = {};
  if (startDate && endDate) {
    query.date_time = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }
  if (status) {
    query.status = status;
  }

  const appointments = await Appointment.find(query)
    .populate("patient", "full_name")
    .populate("doctor", "full_name");

  const statusStats = await Appointment.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const reportData = {
    appointments,
    totalAppointments: appointments.length,
    statusDistribution: statusStats,
    dateRange: { startDate, endDate },
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Appointment reports retrieved successfully",
        reportData
      )
    );
});

export const getInventoryReports = asyncHandler(async (req, res) => {
  const { type, lowStock } = req.query;

  let query = {};
  if (type) {
    query.type = type;
  }
  if (lowStock === "true") {
    query.$expr = { $lt: ["$quantity_available", "$minimum_required"] };
  }

  const inventory = await Inventory.find(query);
  const typeStats = await Inventory.aggregate([
    { $group: { _id: "$type", count: { $sum: 1 } } },
  ]);

  const lowStockItems = await Inventory.find({
    $expr: { $lt: ["$quantity_available", "$minimum_required"] },
  });

  const reportData = {
    inventory,
    totalItems: inventory.length,
    typeDistribution: typeStats,
    lowStockItems: lowStockItems.length,
    lowStockItemsList: lowStockItems,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Inventory reports retrieved successfully",
        reportData
      )
    );
});
