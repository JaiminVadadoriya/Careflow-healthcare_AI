import MedicalRecord from "../models/medical_record.model.js";
import Bed from "../models/bed.model.js";
import Patient from "../models/patient.model.js";
import { APIError } from "../utils/api_error_handler.utils.js";

class NurseService {
  async addPatientVitals(patientId, nurseId, vitals) {
    return await MedicalRecord.create({
      patient: patientId,
      doctor: nurseId, // Assuming nurse ID is stored in doctor field for vitals, or schema needs update
      diagnosis: "Vital Signs Check",
      treatment: JSON.stringify(vitals),
    });
  }

  async assignBed(bedId, patientId) {
    const bed = await Bed.findById(bedId);
    if (!bed) throw new APIError(404, "Bed not found");
    if (bed.is_occupied) throw new APIError(400, "Bed already occupied");

    bed.assigned_patient = patientId;
    bed.is_occupied = true;
    await bed.save();
    return bed;
  }

  async releaseBed(bedId) {
    const bed = await Bed.findById(bedId);
    if (!bed) throw new APIError(404, "Bed not found");
    if (!bed.is_occupied) throw new APIError(400, "Bed is already unoccupied");

    bed.assigned_patient = null;
    bed.is_occupied = false;
    await bed.save();
    return bed;
  }

  async getPatientById(patientId) {
    const patient = await Patient.findById(patientId)
      .select("-password -refreshToken")
      .populate("assigned_doctor", "full_name role")
      .populate("medical_history", "diagnosis date_time");

    if (!patient) throw new APIError(404, "Patient not found");
    return patient;
  }

  async getAssignedPatients(nurseId) {
    return await Patient.find({ assigned_nurse: nurseId })
      .select("-password -refreshToken")
      .populate("assigned_doctor", "full_name")
      .populate("medical_history", "diagnosis date_time");
  }
}

export default new NurseService();
