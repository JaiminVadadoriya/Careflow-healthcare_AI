import Appointment from "../models/appointment.model.js"; // Assuming ES Module import

// Book an appointment
export const bookAppointment = async (req, res) => {
  const { patient_id, doctor_id, date_time, reason } = req.body;

  // Basic validation
  if (!patient_id || !doctor_id || !date_time || !reason) {
    return res.status(400).json({ message: "All fields are required." });
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
      .json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    console.error(error); // Log the actual error for debugging
    res
      .status(500)
      .json({ message: "Error booking appointment", error: error.message });
  }
};

// Get all appointments (Admin-only)
export const getAppointments = async (req, res) => {
  // You might want to add authentication middleware here to ensure only admins can access this

  try {
    const appointments = await Appointment.find().populate("patient doctor");
    res.json(appointments);
  } catch (error) {
    console.error(error); // Log the actual error for debugging
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};
