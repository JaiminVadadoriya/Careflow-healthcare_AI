import express from "express";
import AuthController from "../controllers/auth.controller.js";
import UserController from "../controllers/user.controller.js";
import DoctorController from "../controllers/doctor.controller.js";
import NurseController from "../controllers/nurse.controller.js";
// import ReceptionistController from "../controllers/receptionist.controller.js";
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
 * 👨‍⚕️ Doctor Routes (Moved to doctor.routes.js)
 */
// Routes migrated to /api/v1/doctor/...


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
router.get('/nurse/patients/all', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['nurse']), NurseController.getAllPatients);

// New Nurse Routes for Future-Proofing
router.get('/nurse/dashboard-stats', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['nurse']), NurseController.getDashboardStats);
router.get('/nurse/orders/:patientId', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['nurse']), NurseController.getDoctorOrders);
router.post('/nurse/notes/:patientId', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['nurse']), NurseController.addNursingNote);
router.get('/nurse/notes/:patientId', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['nurse']), NurseController.getNursingNotes);

// Receptionist routes moved to receptionist.routes.js

// Keep doctors route for general access if needed
router.get('/nurse/vitals/:patientId', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['nurse']), NurseController.getPatientVitals);
router.get('/doctors', AuthMiddleware.authenticate, DoctorController.getAllDoctors);

export default router;
