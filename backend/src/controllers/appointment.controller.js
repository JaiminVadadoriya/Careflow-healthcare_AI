import Appointment from "../models/appointment.model.js"; // Assuming ES Module import
import { APIError } from '../utils/api_error_handler.utils.js';
import ApiResponse from '../utils/api_response.utils.js';

// Book an appointment
export const bookAppointment = async (req, res) => {
  const { patient_id, doctor_id, date_time, reason } = req.body;

  // Basic validation
  if (!patient_id || !doctor_id || !date_time || !reason) {
    throw new APIError(400, "All fields are required.");
  }

  try {
    const appointment = new Appointment({
      patient: patient_id,
      doctor: doctor_id,
      date_time,
      reason,
    });

    await appointment.save();
    res
      .status(201)
      .json(
        new ApiResponse(201, "Appointment booked successfully", appointment));
  } catch (error) {
    console.error(error); // Log the actual error for debugging
    throw new APIError(500, "Error booking appointment", error.message);
  }
};

// Get all appointments (Admin-only)
export const getAppointments = async (req, res) => {
  // You might want to add authentication middleware here to ensure only admins can access this

  try {
    const appointments = await Appointment.find().populate("patient doctor");
    res.status(200).json(
      new ApiResponse(200, "Appointments retrieved successfully", appointments)
    );
  } catch (error) {
    console.error(error); // Log the actual error for debugging
    throw new APIError(500, "Error fetching appointments", error.message);
  }
};
