import DoctorService from "../services/doctor.service.js";
import ApiResponse from "../utils/api_response.utils.js";
import { asyncHandler } from "../utils/async_handler.utils.js";
import { APIError } from "../utils/api_error_handler.utils.js";

class DoctorController {
  getAssignedPatients = asyncHandler(async (req, res) => {
    const patients = await DoctorService.getAssignedPatients(req.user._id);
    return res.status(200).json(new ApiResponse(200, "Assigned patients retrieved", patients));
  });

  updateMedicalRecord = asyncHandler(async (req, res) => {
    const { diagnosis, treatment } = req.body;
    if (!diagnosis || !treatment) {
      throw new APIError(400, "Diagnosis and treatment are required");
    }
    const record = await DoctorService.updateMedicalRecord(req.params.id, req.user._id, { diagnosis, treatment });
    return res.status(200).json(new ApiResponse(200, "Medical record updated", record));
  });

  getDoctorAppointments = asyncHandler(async (req, res) => {
    const appointments = await DoctorService.getDoctorAppointments(req.user._id);
    return res.status(200).json(new ApiResponse(200, "Appointments retrieved", appointments));
  });

  updateAppointmentStatus = asyncHandler(async (req, res) => {
     const { status } = req.body;
     if (!['scheduled', 'arrived', 'completed', 'cancelled'].includes(status)) {
         throw new APIError(400, "Invalid status");
     }
     const result = await DoctorService.updateAppointmentStatus(req.params.id, req.user._id, status);
     return res.status(200).json(new ApiResponse(200, "Appointment status updated", result));
  });

  rescheduleAppointment = asyncHandler(async (req, res) => {
    const { date_time } = req.body;
    if (!date_time) {
        throw new APIError(400, "New date_time is required");
    }
    const result = await DoctorService.rescheduleAppointment(req.params.id, req.user._id, date_time);
    return res.status(200).json(new ApiResponse(200, "Appointment rescheduled", result));
  });

  getAllDoctors = asyncHandler(async (req, res) => {
    const doctors = await DoctorService.getAllDoctors();
    return res.status(200).json(new ApiResponse(200, "Doctors retrieved successfully", doctors));
  });

  getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await DoctorService.getDashboardStats(req.user._id);
    return res.status(200).json(new ApiResponse(200, "Dashboard stats retrieved", stats));
  });

  createPrescription = asyncHandler(async (req, res) => {
    const prescription = await DoctorService.createPrescription(req.user._id, req.body);
    return res.status(201).json(new ApiResponse(201, "Prescription created", prescription));
  });

  getPatientPrescriptions = asyncHandler(async (req, res) => {
    const prescriptions = await DoctorService.getPatientPrescriptions(req.params.patientId);
    return res.status(200).json(new ApiResponse(200, "Prescriptions retrieved", prescriptions));
  });

  orderLabTest = asyncHandler(async (req, res) => {
    const labOrder = await DoctorService.orderLabTest(req.user._id, req.body);
    return res.status(201).json(new ApiResponse(201, "Lab test ordered", labOrder));
  });

  getPatientLabOrders = asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const orders = await DoctorService.getPatientLabOrders(patientId);
    return res.status(200).json(new ApiResponse(200, "Lab orders retrieved", orders));
  });
}

export default new DoctorController();
