import express from "express";
import {
    addPatientVitals,
    assignOrReleaseBed,
    createUser,
    deleteUser,
    getAssignedPatients,
    getCurrentUser,
    getDoctorAppointments,
    getNursePatientById,
    getUsers,
    loginUser,
    logoutUser,
    receptionistBookAppointment,
    receptionistCheckInPatient,
    receptionistRegisterPatient,
    receptionistDischargePatient,
    refreshAccessToken,
    updateAccountDetails,
    updateMedicalRecord,
    updateUserDetails,
    updateUserRole,
    updateUserStatus,
    receptionistUpdateAppointment,
    getDashboardReports,
    getUserReports,
    getAppointmentReports,
    getAllDoctors,
    getAllPatients,
    getInventoryReports,
    receptionistAllRegisterPatient,
    getNurseAssignedPatients
} from "../controllers/user.controller.js"; // These need to exist in your controller
import { verifyJWT } from "../middlewares/auth.middleware.js";
import checkRole from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * 🔓 Public Routes
 */
// router.post("/register", createUser); // Usually Admin-only (via frontend UI)
router.post("/", verifyJWT, checkRole(["admin"]), createUser); // POST /users

router.post("/login", loginUser); // Login

/**
 * 🔐 Authenticated Routes
 */
router.post("/logout", verifyJWT, logoutUser); // Logout
router.post("/refresh", verifyJWT, refreshAccessToken); // Refresh token
router.get("/current-user", verifyJWT, getCurrentUser); // Current user info
router.patch("/me", verifyJWT, updateAccountDetails); // Update user info

router.patch("/:id", verifyJWT, checkRole(["admin"]), updateUserDetails);
router.patch("/:id/status", verifyJWT, checkRole(["admin"]), updateUserStatus);
router.patch("/:id/role", verifyJWT, checkRole(["admin"]), updateUserRole);
router.delete("/:id", verifyJWT, checkRole(["admin"]), deleteUser);

/**
 * 👑 Admin Routes
 */
router.get("/", verifyJWT, checkRole(["admin"]), getUsers); // View all users
router.get("/reports/dashboard", verifyJWT, checkRole(["admin"]), getDashboardReports); // Dashboard reports
router.get("/reports/users", verifyJWT, checkRole(["admin"]), getUserReports); // User reports
router.get("/reports/appointments", verifyJWT, checkRole(["admin"]), getAppointmentReports); // Appointment reports
router.get("/reports/inventory", verifyJWT, checkRole(["admin"]), getInventoryReports); // Inventory reports

/**
 * 👨‍⚕️ Doctor Routes
 */
router.get(
  "/doctor/patients",
  verifyJWT,
  checkRole(["doctor"]),
  getAssignedPatients
);
router.patch(
  "/doctor/records/:id",
  verifyJWT,
  checkRole(["doctor"]),
  updateMedicalRecord
);
router.get(
  "/doctor/appointments",
  verifyJWT,
  checkRole(["doctor"]),
  getDoctorAppointments
);

/**
 * 👩‍⚕️ Nurse Routes
 */
router.post(
  "/nurse/vitals/:patientId",
  verifyJWT,
  checkRole(["nurse"]),
  addPatientVitals
);
router.patch(
  "/nurse/bed-assignment",
  verifyJWT,
  checkRole(["nurse"]),
  assignOrReleaseBed
);
router.get(
  "/nurse/patient/:id",
  verifyJWT,
  checkRole(["nurse"]),
  getNursePatientById
);
router.get('/nurse/patients', verifyJWT, checkRole(['nurse']), getNurseAssignedPatients);

/**
 * 💁 Receptionist Routes
 */
router.post(
  "/receptionist/register",
  verifyJWT,
  checkRole(["receptionist"]),
  receptionistRegisterPatient
);
router.post(
  "/receptionist/appointments",
  verifyJWT,
  // checkRole(["receptionist"]),
  receptionistBookAppointment
);
router.get(
  "/receptionist/appointments",
  verifyJWT,
  checkRole(["receptionist"]),
  receptionistAllRegisterPatient
);
router.patch(
  "/receptionist/checkin/:patientId",
  verifyJWT,
  checkRole(["receptionist"]),
  receptionistCheckInPatient
);

router.patch(
  "/receptionist/appointments/:id",
  verifyJWT,
  checkRole(["receptionist"]),
  receptionistUpdateAppointment
);

router.patch(
  "/receptionist/discharge/:patientId",
  verifyJWT,
  checkRole(["receptionist"]),
  receptionistDischargePatient
);

router.get('/doctors', verifyJWT, getAllDoctors);

router.get('/patients', verifyJWT, checkRole([ 'receptionist']), getAllPatients);
export default router;
