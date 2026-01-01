import { Router } from "express";
import ReceptionistController from "../controllers/receptionist.controller.js";
import { getAppointments } from "../controllers/appointment.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// Apply Global Auth and Role Restriction
router.use(AuthMiddleware.authenticate);
router.use(AuthMiddleware.restrictTo(["receptionist", "admin"]));

// Patient Management
router.post("/patients", ReceptionistController.registerPatient);
router.get("/patients", ReceptionistController.getAllPatients);
router.get("/doctors", ReceptionistController.getDoctors); // New Route
router.patch("/patients/:patientId/checkin", ReceptionistController.checkInPatient);
router.patch("/patients/:patientId/discharge", ReceptionistController.dischargePatient);

// Doctor Availability
router.get("/doctors/:doctorId/availability", ReceptionistController.getDoctorAvailability);

// Appointment Management
router.post("/appointments", ReceptionistController.bookAppointment);
router.get("/appointments", getAppointments);
router.patch("/appointments/:id", ReceptionistController.updateAppointment);

export default router;
