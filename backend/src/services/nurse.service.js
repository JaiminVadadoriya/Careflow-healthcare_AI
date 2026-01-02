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
    const patients = await Patient.find({ current_status: "admitted" })
      .select("-password -refreshToken")
      .populate("assigned_doctor", "full_name")
      .lean();
    
    console.log(`NurseService: Found ${patients.length} admitted patients.`);

    const patientIds = patients.map(p => p._id);
    const beds = await Bed.find({ assigned_patient: { $in: patientIds } })
        .select('room_number ward assigned_patient');

    const patientBedMap = {};
    beds.forEach(bed => {
        patientBedMap[bed.assigned_patient.toString()] = bed;
    });

    return patients.map(p => ({
        ...p,
        bed: patientBedMap[p._id.toString()] || null
    }));
  }

  async getAllPatients(search) {
      const filter = {};
      if (search) {
          filter.full_name = { $regex: search, $options: 'i' };
      }
      // Return top 50 to avoid performance hit
      return await Patient.find(filter)
        .select("full_name dob gender current_status")
        .sort({ createdAt: -1 })
        .limit(50);
  }

  async getDoctorOrders(patientId) {
      // Fetch medical records where diagnosis/treatment indicates an order
      // Or if there's a specific 'Prescription' model? Using MedicalRecord for now.
      return await MedicalRecord.find({ patient: patientId })
        .populate("doctor", "full_name")
        .sort({ createdAt: -1 });
  }

  async addNursingNote(patientId, nurseId, note, type = 'general') {
      // We can use MedicalRecord with a specific type or a new model.
      // For simplicity/speed, let's use MedicalRecord with a specific 'diagnosis' tag like 'Nursing Note'
      return await MedicalRecord.create({
          patient: patientId,
          doctor: nurseId, // Storing nurse ID here
          diagnosis: `Nursing Note: ${type}`,
          treatment: note // Storing the actual note here
      });
  }

  async getNursingNotes(patientId) {
      return await MedicalRecord.find({ 
          patient: patientId, 
          diagnosis: { $regex: 'Nursing Note', $options: 'i' } 
      })
      .populate("doctor", "full_name")
      .sort({ createdAt: -1 });
  }

  async getPatientVitals(patientId) {
      return await MedicalRecord.find({ 
          patient: patientId, 
          diagnosis: "Vital Signs Check" 
      })
      .populate("doctor", "full_name")
      .sort({ createdAt: -1 });
  }

  async getDashboardStats() {
      const activePatients = await Patient.countDocuments({ current_status: "admitted" });
      const criticalPatients = await Patient.countDocuments({ current_status: "active" }); // Proxy for critical? Or check vitals?
      
      const totalBeds = await Bed.countDocuments();
      const occupiedBeds = await Bed.countDocuments({ is_occupied: true });
      
      // Get recent alerts (e.g. abnormal vitals - this would require complex query, skipped for now or mock)
      
      return {
          activePatients,
          criticalPatients, // placeholder logic
          availableBeds: totalBeds - occupiedBeds,
          occupiedBeds
      };
  }
}

export default new NurseService();
