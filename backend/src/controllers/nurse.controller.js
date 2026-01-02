import NurseService from "../services/nurse.service.js";
import ApiResponse from "../utils/api_response.utils.js";
import { asyncHandler } from "../utils/async_handler.utils.js";
import { APIError } from "../utils/api_error_handler.utils.js";

class NurseController {
  addPatientVitals = asyncHandler(async (req, res) => {
    const { blood_pressure, heart_rate, temperature, oxygen_saturation } = req.body;
    const vitals = { blood_pressure, heart_rate, temperature, oxygen_saturation, recorded_by: req.user.id };
    
    // Pass req.user.id as the nurseId/doctor
    const record = await NurseService.addPatientVitals(req.params.patientId, req.user.id, vitals);
    return res.status(201).json(new ApiResponse(201, "Vitals recorded successfully", record));
  });

  assignOrReleaseBed = asyncHandler(async (req, res) => {
    const { bedId, patientId, action } = req.body;
    let bed;
    
    if (action === "assign") {
        bed = await NurseService.assignBed(bedId, patientId);
    } else if (action === "release") {
        bed = await NurseService.releaseBed(bedId);
    } else {
        throw new APIError(400, "Invalid action. Use 'assign' or 'release'");
    }

    return res.status(200).json(new ApiResponse(200, `Bed ${action}ed successfully`, bed));
  });

  getNursePatientById = asyncHandler(async (req, res) => {
    const patient = await NurseService.getPatientById(req.params.id);
    return res.status(200).json(new ApiResponse(200, "Patient details retrieved", patient));
  });

  getNurseAssignedPatients = asyncHandler(async (req, res) => {
    // req.user.id is passed but service ignores it now to return all admitted
    const patients = await NurseService.getAssignedPatients(req.user.id);
    return res.status(200).json(new ApiResponse(200, "Assigned patients retrieved", patients));
  });

  getDoctorOrders = asyncHandler(async (req, res) => {
    const orders = await NurseService.getDoctorOrders(req.params.patientId);
    return res.status(200).json(new ApiResponse(200, "Doctor orders retrieved", orders));
  });

  addNursingNote = asyncHandler(async (req, res) => {
    const { note, type } = req.body;
    const record = await NurseService.addNursingNote(req.params.patientId, req.user.id, note, type);
    return res.status(201).json(new ApiResponse(201, "Nursing note added", record));
  });

  getNursingNotes = asyncHandler(async (req, res) => {
    const notes = await NurseService.getNursingNotes(req.params.patientId);
    return res.status(200).json(new ApiResponse(200, "Nursing notes retrieved", notes));
  });

  getPatientVitals = asyncHandler(async (req, res) => {
    const vitals = await NurseService.getPatientVitals(req.params.patientId);
    return res.status(200).json(new ApiResponse(200, "Vitals retrieved successfully", vitals));
  });

  getDashboardStats = asyncHandler(async (req, res) => {
    const stats = await NurseService.getDashboardStats();
    return res.status(200).json(new ApiResponse(200, "Dashboard stats retrieved", stats));
  });
}

export default new NurseController();
