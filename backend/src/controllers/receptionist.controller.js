import ReceptionistService from "../services/receptionist.service.js";
import ApiResponse from "../utils/api_response.utils.js";
import { asyncHandler } from "../utils/async_handler.utils.js";
import { APIError } from "../utils/api_error_handler.utils.js";

class ReceptionistController {
  registerPatient = asyncHandler(async (req, res) => {
    const patient = await ReceptionistService.registerPatient(req.body);
    return res.status(201).json(new ApiResponse(201, "Patient registered successfully", patient));
  });

  getAllPatients = asyncHandler(async (req, res) => {
    const patients = await ReceptionistService.getAllPatients();
    return res.status(200).json(new ApiResponse(200, "Patients retrieved successfully", patients));
  });

  getDoctors = asyncHandler(async (req, res) => {
    const doctors = await ReceptionistService.getDoctors();
    return res.status(200).json(new ApiResponse(200, "Doctors retrieved successfully", doctors));
  });

  bookAppointment = asyncHandler(async (req, res) => {
    const appointment = await ReceptionistService.bookAppointment(req.body);
    return res.status(201).json(new ApiResponse(201, "Appointment booked successfully", appointment));
  });

  updateAppointment = asyncHandler(async (req, res) => {
    const { status, date_time } = req.body;
    const update = {};
    if (status) update.status = status;
    if (date_time) update.date_time = date_time;

    const appointment = await ReceptionistService.updateAppointment(req.params.id, update);
    return res.status(200).json(new ApiResponse(200, "Appointment updated", appointment));
  });

  checkInPatient = asyncHandler(async (req, res) => {
    const patient = await ReceptionistService.checkInPatient(req.params.patientId);
    return res.status(200).json(new ApiResponse(200, "Patient checked in successfully", patient));
  });

  dischargePatient = asyncHandler(async (req, res) => {
    const patient = await ReceptionistService.dischargePatient(req.params.patientId);
    return res.status(200).json(new ApiResponse(200, "Patient discharged successfully", patient));
  });

  getDoctorAvailability = asyncHandler(async (req, res) => {
    const { date } = req.query;
    const availability = await ReceptionistService.getDoctorAvailability(req.params.doctorId, date);
    return res.status(200).json(new ApiResponse(200, "Availability retrieved", availability));
  });
}

export default new ReceptionistController();
