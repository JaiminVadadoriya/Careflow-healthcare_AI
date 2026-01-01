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

  getAllDoctors = asyncHandler(async (req, res) => {
    const doctors = await DoctorService.getAllDoctors();
    return res.status(200).json(new ApiResponse(200, "Doctors retrieved successfully", doctors));
  });
}

export default new DoctorController();
