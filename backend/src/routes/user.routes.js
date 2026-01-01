import express from "express";
import AuthController from "../controllers/auth.controller.js";
import UserController from "../controllers/user.controller.js";
import DoctorController from "../controllers/doctor.controller.js";
import NurseController from "../controllers/nurse.controller.js";
import ReceptionistController from "../controllers/receptionist.controller.js";
import AdminController from "../controllers/admin.controller.js";

import AuthMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * 🔓 Public Routes
 */
router.post("/", AuthMiddleware.authenticate, AuthMiddleware.restrictTo(["admin"]), AuthController.register); // POST /users

router.post("/login", AuthController.login); // Login

/**
 * 🔐 Authenticated Routes
 */
router.post("/logout", AuthMiddleware.authenticate, AuthController.logout); // Logout
router.post("/refresh", AuthMiddleware.authenticate, AuthController.refreshAccessToken); // Refresh token
router.get("/current-user", AuthMiddleware.authenticate, UserController.getCurrentUser); // Current user info
router.patch("/me", AuthMiddleware.authenticate, UserController.updateAccountDetails); // Update user info

router.patch("/:id", AuthMiddleware.authenticate, AuthMiddleware.restrictTo(["admin"]), UserController.updateUserDetails);
router.patch("/:id/status", AuthMiddleware.authenticate, AuthMiddleware.restrictTo(["admin"]), UserController.updateUserStatus);
router.patch("/:id/role", AuthMiddleware.authenticate, AuthMiddleware.restrictTo(["admin"]), UserController.updateUserRole);
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.restrictTo(["admin"]), UserController.deleteUser);

/**
 * 👑 Admin Routes
 */
router.get("/", AuthMiddleware.authenticate, AuthMiddleware.restrictTo(["admin"]), UserController.getUsers); // View all users
router.get("/reports/dashboard", AuthMiddleware.authenticate, AuthMiddleware.restrictTo(["admin"]), AdminController.getDashboardReports);
router.get("/reports/users", AuthMiddleware.authenticate, AuthMiddleware.restrictTo(["admin"]), AdminController.getUserReports);
router.get("/reports/appointments", AuthMiddleware.authenticate, AuthMiddleware.restrictTo(["admin"]), AdminController.getAppointmentReports);
router.get("/reports/inventory", AuthMiddleware.authenticate, AuthMiddleware.restrictTo(["admin"]), AdminController.getInventoryReports);

/**
 * 👨‍⚕️ Doctor Routes
 */
router.get(
  "/doctor/patients",
  AuthMiddleware.authenticate,
  AuthMiddleware.restrictTo(["doctor"]),
  DoctorController.getAssignedPatients
);
router.patch(
  "/doctor/records/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.restrictTo(["doctor"]),
  DoctorController.updateMedicalRecord
);
router.get(
  "/doctor/appointments",
  AuthMiddleware.authenticate,
  AuthMiddleware.restrictTo(["doctor"]),
  DoctorController.getDoctorAppointments
);

/**
 * 👩‍⚕️ Nurse Routes
 */
router.post(
  "/nurse/vitals/:patientId",
  AuthMiddleware.authenticate,
  AuthMiddleware.restrictTo(["nurse"]),
  NurseController.addPatientVitals
);
router.patch(
  "/nurse/bed-assignment",
  AuthMiddleware.authenticate,
  AuthMiddleware.restrictTo(["nurse"]),
  NurseController.assignOrReleaseBed
);
router.get(
  "/nurse/patient/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.restrictTo(["nurse"]),
  NurseController.getNursePatientById
);
router.get('/nurse/patients', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['nurse']), NurseController.getNurseAssignedPatients);

/**
 * 💁 Receptionist Routes
 */
router.post(
  "/receptionist/register",
  AuthMiddleware.authenticate,
  AuthMiddleware.restrictTo(["receptionist"]),
  ReceptionistController.registerPatient
);
router.post(
  "/receptionist/appointments",
  AuthMiddleware.authenticate,
  ReceptionistController.bookAppointment
);
router.get(
  "/receptionist/appointments",
  AuthMiddleware.authenticate,
  AuthMiddleware.restrictTo(["receptionist"]),
  ReceptionistController.getAllPatients 
);
router.patch(
  "/receptionist/checkin/:patientId",
  AuthMiddleware.authenticate,
  AuthMiddleware.restrictTo(["receptionist"]),
  ReceptionistController.checkInPatient
);

router.patch(
  "/receptionist/appointments/:id",
  AuthMiddleware.authenticate,
  AuthMiddleware.restrictTo(["receptionist"]),
  ReceptionistController.updateAppointment
);

router.patch(
  "/receptionist/discharge/:patientId",
  AuthMiddleware.authenticate,
  AuthMiddleware.restrictTo(["receptionist"]),
  ReceptionistController.dischargePatient
);

router.get('/doctors', AuthMiddleware.authenticate, DoctorController.getAllDoctors);

router.get('/patients', AuthMiddleware.authenticate, AuthMiddleware.restrictTo([ 'receptionist']), ReceptionistController.getAllPatients);

export default router;
