// patient.controller.js
import Appointment from '../models/appointment.model.js';
import lab_test_result from '../models/lab_test_result.js';
import medical_recordModel from '../models/medical_record.model.js';
// import LabTestResult from '../models/labTestResult.model.js';
// import MedicalRecord from '../models/medicalRecord.model.js';
import Patient from '../models/patient.model.js';
import { APIError } from '../utils/api_error_handler.utils.js';
import ApiResponse from '../utils/api_response.utils.js';
import { asyncHandler } from '../utils/async_handler.utils.js';
import { generateAccessAndRefreshTokens } from '../utils/token.utils.js';

// 🟢 Public Routes
export const registerPatient = asyncHandler(async (req, res) => {
  const { full_name, dob, gender, contact_info, emergency_contact, password } = req.body;

  // Validate required fields
  const requiredFields = { full_name, dob, gender, contact_info, emergency_contact, password };
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      throw new APIError(400, `${key.replace('_', ' ')} is required`);
    }
  }

  // Check for existing patient
  const existingPatient = await Patient.findOne({
    $or: [
      { 'contact_info.email': contact_info.email },
      { 'contact_info.phone': contact_info.phone }
    ]
  });

  if (existingPatient) {
    throw new APIError(409, 'Patient with this email or phone already exists');
  }

  const patient = await Patient.create({
    full_name,
    dob,
    gender,
    contact_info,
    emergency_contact,
    password
  });

  const createdPatient = await Patient.findById(patient._id).select('-password -refreshToken');
  return res
    .status(201)
    .json(new ApiResponse(201, createdPatient, 'Patient registered successfully'));
});

export const loginPatient = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new APIError(400, 'Email and password are required');
  }

  const patient = await Patient.findOne({ 'contact_info.email': email });
  if (!patient) {
    throw new APIError(404, 'Patient not found');
  }

  const isPasswordValid = await patient.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new APIError(401, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(patient);

  const loggedInPatient = await Patient.findById(patient._id).select('-password -refreshToken');
  
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(new ApiResponse(200, {
      patient: loggedInPatient,
      accessToken,
      refreshToken
    }, 'Login successful'));
});

// 🔐 Authenticated Routes
export const getCurrentUser = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.patient?._id).select('-password -refreshToken');
  return res
    .status(200)
    .json(new ApiResponse(200, patient, 'Current patient fetched successfully'));
});

export const updateAccountDetails = asyncHandler(async (req, res) => {
  const { full_name, contact_info } = req.body;

  const updateFields = {};
  if (full_name) updateFields.full_name = full_name;
  if (contact_info) updateFields.contact_info = contact_info;

  const updatedPatient = await Patient.findByIdAndUpdate(
    req.patient._id,
    updateFields,
    { new: true, runValidators: true }
  ).select('-password -refreshToken');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPatient, 'Account details updated successfully'));
});

// 🏥 Patient Data Management
export const getPatientData = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.params.patientId)
    .select('-password -refreshToken')
    .populate('assigned_doctor', 'full_name specialization')
    .populate('medical_history', 'diagnosis date_time');

  if (!patient) {
    throw new APIError(404, 'Patient not found');
  }

  // Authorization check
  if (patient._id.toString() !== req.patient?._id.toString() && req.user?.role !== 'doctor') {
    throw new APIError(403, 'Unauthorized access');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, patient, 'Patient data retrieved successfully'));
});

export const updatePatientData = asyncHandler(async (req, res) => {
  const { patientId } = req.params;
  
  if (patientId !== req.patient?._id.toString()) {
    throw new APIError(403, 'You can only update your own profile');
  }

  const allowedUpdates = ['contact_info', 'emergency_contact'];
  const updates = Object.keys(req.body).filter(key => allowedUpdates.includes(key));
  
  if (updates.length === 0) {
    throw new APIError(400, 'No valid fields to update');
  }

  const updatedPatient = await Patient.findByIdAndUpdate(
    patientId,
    req.body,
    { new: true, runValidators: true }
  ).select('-password -refreshToken');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPatient, 'Patient data updated successfully'));
});

// 🗓️ Appointments
export const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.patient._id })
    .populate('doctor', 'full_name specialization')
    .sort({ date_time: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, appointments, 'Appointments retrieved successfully'));
});

export const postAppointments = asyncHandler(async (req, res) => {
  const { doctorId, date_time, reason } = req.body;

  if (!doctorId || !date_time || !reason) {
    throw new APIError(400, 'Doctor ID, date/time, and reason are required');
  }

  const doctorExists = await User.exists({ _id: doctorId, role: 'doctor' });
  if (!doctorExists) {
    throw new APIError(404, 'Doctor not found');
  }

  const conflictingAppointment = await Appointment.findOne({
    doctor: doctorId,
    date_time: { $gte: new Date(date_time) }
  });

  if (conflictingAppointment) {
    throw new APIError(409, 'Doctor has conflicting appointment');
  }

  const appointment = await Appointment.create({
    patient: req.patient._id,
    doctor: doctorId,
    date_time,
    reason
  });

  return res
    .status(201)
    .json(new ApiResponse(201, appointment, 'Appointment booked successfully'));
});

// 🧪 Lab Results
export const getLabResults = asyncHandler(async (req, res) => {
  const labResults = await lab_test_result.find({ patient: req.patient._id })
    .populate('technician', 'full_name')
    .sort({ test_date: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, labResults, 'Lab results retrieved successfully'));
});

// 📋 Medical Records
export const getMedicalRecords = asyncHandler(async (req, res) => {
  const medicalRecords = await medical_recordModel.find({ patient: req.patient._id })
    .populate('doctor', 'full_name specialization')
    .sort({ date_time: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, medicalRecords, 'Medical records retrieved successfully'));
});

export const getMedicalRecordById = asyncHandler(async (req, res) => {
  const medicalRecord = await medical_recordModel.findOne({
    _id: req.params.recordId,
    patient: req.patient._id
  }).populate('doctor', 'full_name specialization');

  if (!medicalRecord) {
    throw new APIError(404, 'Medical record not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, medicalRecord, 'Medical record retrieved successfully'));
});

export const updateMedicalRecordById = asyncHandler(async (req, res) => {
  const { diagnosis, treatment } = req.body;

  if (!diagnosis && !treatment) {
    throw new APIError(400, 'At least one field (diagnosis or treatment) is required');
  }

  const medicalRecord = await medical_recordModel.findOneAndUpdate(
    {
      _id: req.params.recordId,
      patient: req.patient._id
    },
    { diagnosis, treatment },
    { new: true, runValidators: true }
  );

  if (!medicalRecord) {
    throw new APIError(404, 'Medical record not found or unauthorized');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, medicalRecord, 'Medical record updated successfully'));
});

// Optional Admin Endpoints
export const addPatient = asyncHandler(async (req, res) => {
  if (req.user?.role !== 'admin') {
    throw new APIError(403, 'Admin privileges required');
  }

  const { full_name, dob, gender, contact_info, emergency_contact, password } = req.body;

  const patient = await Patient.create({
    full_name,
    dob,
    gender,
    contact_info,
    emergency_contact,
    password
  });

  return res
    .status(201)
    .json(new ApiResponse(201, patient, 'Patient added successfully (admin)'));
});

export const getPatients = asyncHandler(async (req, res) => {
  if (req.user?.role !== 'admin') {
    throw new APIError(403, 'Admin privileges required');
  }

  const patients = await Patient.find().select('-password -refreshToken');
  return res
    .status(200)
    .json(new ApiResponse(200, patients, 'Patients retrieved successfully'));
});