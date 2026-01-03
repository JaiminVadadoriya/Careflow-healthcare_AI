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

  async updateAppointmentStatus(appointmentId, doctorId, status) {
    const appointment = await Appointment.findOne({ _id: appointmentId, doctor: doctorId });
    if (!appointment) throw new APIError(404, "Appointment not found or unauthorized");
    
    appointment.status = status;
    await appointment.save();
    return appointment;
  }

  async rescheduleAppointment(appointmentId, doctorId, newDate) {
    const appointment = await Appointment.findOne({ _id: appointmentId, doctor: doctorId });
    if (!appointment) throw new APIError(404, "Appointment not found or unauthorized");

    // Check availability (Reuse logic from ReceptionistService or simple check)
    // For now, simple check: Is this time slot taken by THIS doctor?
    const conflict = await Appointment.findOne({
        doctor: doctorId,
        date_time: new Date(newDate),
        status: { $ne: 'cancelled' },
        _id: { $ne: appointmentId } // Exclude self
    });

    if (conflict) {
        throw new APIError(409, "Time slot already taken");
    }

    appointment.date_time = newDate;
    appointment.status = 'scheduled'; // Reset status if it was cancelling? Or keep as is? Usually rescheduling implies scheduled.
    await appointment.save();
    return appointment;
  }

  async getDashboardStats(doctorId) {
    // 1. Total Assigned Patients
    const patientsCount = await Patient.countDocuments({ assigned_doctor: doctorId });

    // 2. Pending Appointments (Today & Future)
    const pendingAppointments = await Appointment.countDocuments({
        doctor: doctorId,
        status: { $in: ['scheduled', 'arrived'] },
        date_time: { $gte: new Date() }
    });

    // 3. Appointments Today
    const startOfDay = new Date(); startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(); endOfDay.setHours(23,59,59,999);
    const todayAppointments = await Appointment.countDocuments({
        doctor: doctorId,
        date_time: { $gte: startOfDay, $lte: endOfDay }
    });

    // 4. Upcoming Appointments List (Next 5)
    // Prioritize 'arrived' patients? For now just sort by time.
    const upcomingAppointments = await Appointment.find({
        doctor: doctorId,
        status: { $in: ['scheduled', 'arrived'] },
        date_time: { $gte: new Date() }
    })
    .sort({ date_time: 1 })
    .limit(5)
    .populate('patient', 'full_name');

    // 5. Total Consultations (Completed Appointments)
    const consultations = await Appointment.countDocuments({
        doctor: doctorId,
        status: 'completed'
    });

    return {
        assignedPatients: patientsCount,
        pendingAppointments,
        todayAppointments,
        upcomingAppointments,
        consultations
    };
  }

  async createPrescription(doctorId, prescriptionData) {
      const { patientId, medications, notes } = prescriptionData;
      
      // Use MedicalRecord with type 'Prescription'
      // Ideally we would have a separate Prescription model for strict schema, 
      // but MedicalRecord is flexible enough for now with JSON structure in 'treatment'
      
      return await MedicalRecord.create({
          patient: patientId,
          doctor: doctorId,
          diagnosis: 'Prescription', // Tag
          treatment: JSON.stringify({ medications, notes }), // Store structured data
          date: new Date()
      });
  }

  async getPatientPrescriptions(patientId) {
      return await MedicalRecord.find({
          patient: patientId,
          diagnosis: 'Prescription'
      }).populate('doctor', 'full_name').sort({ createdAt: -1 });
  }

  async orderLabTest(doctorId, orderData) {
      const { patientId, testName, priority, notes } = orderData;
      
      return await MedicalRecord.create({
          patient: patientId,
          doctor: doctorId,
          diagnosis: 'Lab Order', // Tag
          treatment: JSON.stringify({ testName, priority, notes, status: 'pending' }),
          date: new Date()
      });
  }

  async getPatientLabOrders(patientId) {
      return await MedicalRecord.find({
          patient: patientId,
          diagnosis: 'Lab Order'
      }).populate('doctor', 'full_name').sort({ createdAt: -1 });
  }
}

export default new DoctorService();
