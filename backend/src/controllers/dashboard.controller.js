import { asyncHandler } from "../utils/async_handler.utils.js";
import ApiResponse from "../utils/api_response.utils.js";
import User from "../models/user.model.js";
import Appointment from "../models/appointment.model.js";
import Patient from "../models/patient.model.js";
import Inventory from "../models/inventory.model.js";
import Bed from "../models/bed.model.js";

// TODO: Refactor into a separate service later if complexity grows
class DashboardController {
  getAdminStats = asyncHandler(async (req, res) => {
    // 1. Total Users
    const totalUsers = await User.countDocuments();
    
    // 2. Appointments (Total, or just today's?) -> Let's get total for now
    const totalAppointments = await Appointment.countDocuments();
    
    // 3. Inventory Items count
    const totalInventoryItems = await Inventory.countDocuments();
    
    // 4. Occupied Beds count (Admitted Patients)
    const occupiedBeds = await Patient.countDocuments({ current_status: { $in: ['admitted', 'icu', 'isolation'] } });

    const stats = {
      totalUsers,
      totalAppointments,
      totalInventoryItems,
      occupiedBeds
    };

    return res
      .status(200)
      .json(new ApiResponse(200, "Admin stats fetched successfully", stats));
  });

  getDoctorStats = asyncHandler(async (req, res) => {
    const doctorId = req.user._id;

    // 1. Assigned Patients (Unique patients in doctor's appointments)
    // For simplicity, let's just count appointments for this doctor for now, as direct patient assignment model is complex
    const assignedAppointments = await Appointment.countDocuments({ doctor: doctorId });
    
    // 2. Today's Visits
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const todaysVisits = await Appointment.countDocuments({
        doctor: doctorId,
        date_time: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    // 3. Pending notes (Placeholder logic for now as 'notes' field logic varies)
    const pendingNotes = 5; 

    // 4. Consultations (Completed appointments)
    const consultations = await Appointment.countDocuments({ doctor: doctorId, status: "completed" });

    const stats = {
        assignedPatients: assignedAppointments, // Proxy for now
        todaysVisits,
        pendingNotes,
        consultations
    };

    return res
      .status(200)
      .json(new ApiResponse(200, "Doctor stats fetched successfully", stats));
  });

  getNurseStats = asyncHandler(async (req, res) => {
     // 1. Ward Capacity (Occupied / Total)
     const totalBeds = await Bed.countDocuments() || 50; // Default to 50 if no beds configured
     const occupiedBeds = await Patient.countDocuments({ current_status: { $in: ['admitted', 'icu', 'isolation'] } });
     
     // 2. Critical Alerts (Placeholder)
     const criticalAlerts = 2;

     // 3. Vitals Recorded (Placeholder)
     const vitalsRecorded = 15;

     // 4. Empty Beds
     const emptyBeds = totalBeds - occupiedBeds;

     const stats = {
         wardCapacity: `${occupiedBeds}/${totalBeds}`,
         criticalAlerts,
         vitalsRecorded,
         emptyBeds /* occupiedBeds: 20 is wrong key name based on frontend usage, using correct one */
     };
     
     return res
      .status(200)
      .json(new ApiResponse(200, "Nurse stats fetched successfully", stats));
  });

  getReceptionistStats = asyncHandler(async (req, res) => {
     // 1. Today's Appointments
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const todaysAppointments = await Appointment.countDocuments({
        date_time: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    // 2. Currently Waiting (Status = 'pending' and today?)
    const currentlyWaiting = await Appointment.countDocuments({
         status: "pending",
         date_time: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    // 3. Checked In (Status = 'arrived')
    const checkedIn = await Appointment.countDocuments({
        status: "arrived",
         date_time: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    // 4. Waiting Queue (List of arrived patients)
    const queue = await Appointment.find({
        status: "arrived",
        date_time: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    })
    .sort({ date_time: 1 })
    .populate("patient", "full_name");

    // 4. New Registrations (Patients created today)
    const newRegistrations = await Patient.countDocuments({
        createdAt: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    const stats = {
        todaysAppointments,
        currentlyWaiting,
        checkedIn,
        newRegistrations,
        queue: queue.map(a => ({
          patientName: a.patient.full_name,
          waitTime: Math.floor((new Date() - new Date(a.date_time)) / 60000) // minutes since appointment time
        }))
    };

    return res
      .status(200)
      .json(new ApiResponse(200, "Receptionist stats fetched successfully", stats));
  });
}

export default new DashboardController();
