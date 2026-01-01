import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import { APIError } from "../utils/api_error_handler.utils.js";

class ReceptionistService {
  async registerPatient(patientData) {
    const { contact_info } = patientData;
    const existingPatient = await Patient.findOne({
      "contact_info.phone": contact_info.phone,
    });

    if (existingPatient) {
      throw new APIError(409, "Patient with this phone number already exists");
    }

    return await Patient.create({
      ...patientData,
      password: "Password123", // Should implement password reset flow
    });
  }

  async getAllPatients() {
    return await Patient.find()
      .populate("assigned_doctor", "full_name email")
      .select("-password -refreshToken");
  }

  async bookAppointment(appointmentData) {
    const { doctorId, date_time } = appointmentData;
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date_time: { $gte: new Date(date_time) },
    });

    if (existingAppointment) {
      throw new APIError(409, "Doctor has overlapping appointment");
    }

    return await Appointment.create(appointmentData);
  }

  async updateAppointment(appointmentId, updateData) {
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, updateData, {
      new: true,
    });
    if (!appointment) throw new APIError(404, "Appointment not found");
    return appointment;
  }

  async checkInPatient(patientId) {
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { admission_date: new Date(), current_status: "admitted" },
      { new: true }
    ).select("-password -refreshToken");

    if (!patient) throw new APIError(404, "Patient not found");
    return patient;
  }

  async dischargePatient(patientId) {
    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { current_status: "discharged", discharge_date: new Date() },
      { new: true }
    ).select("-password -refreshToken");

    if (!patient) throw new APIError(404, "Patient not found");
    return patient;
  }
}

export default new ReceptionistService();
