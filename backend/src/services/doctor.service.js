import Patient from "../models/patient.model.js";
import MedicalRecord from "../models/medical_record.model.js";
import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js";
import { APIError } from "../utils/api_error_handler.utils.js";

class DoctorService {
  async getAssignedPatients(doctorId) {
    const patients = await Patient.find({ assigned_doctor: doctorId })
      .select("-password -refreshToken")
      .populate("medical_history", "diagnosis date_time");

    return patients;
  }

  async updateMedicalRecord(recordId, doctorId, { diagnosis, treatment }) {
    const medicalRecord = await MedicalRecord.findByIdAndUpdate(
      recordId,
      { diagnosis, treatment, doctor: doctorId },
      { new: true, runValidators: true }
    ).populate("patient", "full_name");

    if (!medicalRecord) {
      throw new APIError(404, "Medical record not found");
    }
    return medicalRecord;
  }

  async getDoctorAppointments(doctorId) {
    return await Appointment.find({ doctor: doctorId })
      .populate("patient", "full_name contact_info.phone")
      .sort({ date_time: -1 });
  }

  async getAllDoctors() {
    return await User.find({ role: "doctor" }).select("-password -refreshToken");
  }
}

export default new DoctorService();
