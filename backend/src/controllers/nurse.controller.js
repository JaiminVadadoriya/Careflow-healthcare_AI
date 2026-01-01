import NurseService from "../services/nurse.service.js";
import ApiResponse from "../utils/api_response.utils.js";
import { asyncHandler } from "../utils/async_handler.utils.js";
import { APIError } from "../utils/api_error_handler.utils.js";

class NurseController {
  addPatientVitals = asyncHandler(async (req, res) => {
    const { blood_pressure, heart_rate, temperature, oxygen_saturation } = req.body;
    const vitals = { blood_pressure, heart_rate, temperature, oxygen_saturation, recorded_by: req.user._id };
    
    const record = await NurseService.addPatientVitals(req.params.patientId, req.user._id, vitals);
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
    const patients = await NurseService.getAssignedPatients(req.user._id);
    return res.status(200).json(new ApiResponse(200, "Assigned patients retrieved", patients));
  });
}

export default new NurseController();
