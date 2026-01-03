import { Router } from "express";
import DoctorController from "../controllers/doctor.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// Global middleware for this router
router.use(AuthMiddleware.authenticate);
router.use(AuthMiddleware.restrictTo(["doctor"]));

// Dashboard & Stats
router.get("/dashboard-stats", DoctorController.getDashboardStats);

// Patient Management
router.get("/patients", DoctorController.getAssignedPatients); // Doctor's own patients

// Medical Records & Prescriptions
router.post("/prescriptions", DoctorController.createPrescription);
router.get("/prescriptions/:patientId", DoctorController.getPatientPrescriptions);
router.patch("/records/:id", DoctorController.updateMedicalRecord);

// Lab Orders
router.post("/lab-orders", DoctorController.orderLabTest);
router.get("/lab-orders/:patientId", DoctorController.getPatientLabOrders);

// Appointment Management
// Appointment Management
router.get("/appointments", DoctorController.getDoctorAppointments);
router.patch("/appointments/:id/status", DoctorController.updateAppointmentStatus);
router.patch("/appointments/:id/reschedule", DoctorController.rescheduleAppointment);

export default router;
