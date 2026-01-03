import Patient from "../models/patient.model.js";
import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js";
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

    const patient = await Patient.create({
      ...patientData,
      current_status: "admitted", // Explicitly set status to admitted
      password: "Password123", // Should implement password reset flow
    });
    console.log("Registered New Patient:", patient.full_name, "Status:", patient.current_status);
    return patient;
  }

  async getAllPatients() {
    return await Patient.find()
      .populate("assigned_doctor", "full_name email")
      .select("-password -refreshToken");
  }

  async getDoctors() {
    // Assuming doctors are users with role 'doctor'
    return await User.find({ role: "doctor", status: "active" })
      .select("full_name email specialization");
  }

  async bookAppointment(appointmentData) {
    const { doctorId, patientId, date_time } = appointmentData;
    
    // Check for overlapping appointments for the doctor
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date_time: { 
         $gte: new Date(new Date(date_time).getTime() - 15*60000), // +/- 15 mins buffer or exact? 
         // simplistic check: same exact time or close to it? 
         // The original code was { $gte: new Date(date_time) } which is just "future or same time". 
         // But findOne will just return ANY future appointment, preventing ANY booking?
         // Original code: date_time: { $gte: new Date(date_time) }
         // This seems wrong if I want to check for *overlap* at that specific time.
         // Usually: start < end AND end > start.
         // Let's assume 30 min slots. 
         // A better check is: same doctor, same time.
         $eq: new Date(date_time) 
      },
      status: { $ne: 'cancelled' } 
    });

    if (existingAppointment) {
      throw new APIError(409, "Doctor has overlapping appointment at this time");
    }

    return await Appointment.create({
      ...appointmentData,
      doctor: doctorId,
      patient: appointmentData.patientId // ensure patient ID is mapped correctly if not passed as 'patient'
    });
  }

  async getDoctorAvailability(doctorId, dateStr) {
    // 1. Define working hours (e.g. 09:00 to 17:00)
    const startHour = 9;
    const endHour = 17;
    const slotDuration = 30; // minutes

    // 2. Parse date
    const date = new Date(dateStr);
    const startOfDay = new Date(date); startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(date); endOfDay.setHours(23,59,59,999);

    // 3. Fetch existing appointments
    const appointments = await Appointment.find({
      doctor: doctorId,
      date_time: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' }
    });

    // 4. Generate slots
    const slots = [];
    const current = new Date(date);
    current.setHours(startHour, 0, 0, 0);

    while (current.getHours() < endHour) {
       const timeString = current.toTimeString().slice(0, 5); // "09:00"
       
       // Check if booked
       const isBooked = appointments.some(appt => {
          const apptTime = new Date(appt.date_time).toTimeString().slice(0, 5);
          return apptTime === timeString;
       });

       slots.push({
         time: timeString,
         available: !isBooked,
         dateTime: new Date(current).toISOString() // Return full ISO string for easy booking
       });

       current.setMinutes(current.getMinutes() + slotDuration);
    }

    return slots;
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
      { current_status: "discharged", bed_assigned: null }, // Auto-free bed if any
      { new: true }
    );
    if (!patient) throw new APIError(404, "Patient not found");
    return patient;
  }

  async assignDoctor(patientId, doctorId) {
    const doctorExists = await User.exists({ _id: doctorId, role: 'doctor' });
    if (!doctorExists) throw new APIError(404, "Doctor not found");

    const patient = await Patient.findByIdAndUpdate(
        patientId,
        { assigned_doctor: doctorId },
        { new: true }
    ).populate('assigned_doctor', 'full_name');
    
    if (!patient) throw new APIError(404, "Patient not found");
    return patient;
  }
}

export default new ReceptionistService();
