import express from "express";
import {
    addPatientVitals,
    assignOrReleaseBed,
    createUser,
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
    refreshAccessToken,
    updateAccountDetails,
    updateMedicalRecord,
} from "../controllers/user.controller.js"; // These need to exist in your controller
import { verifyJWT } from "../middlewares/auth.middleware.js";
import checkRole from "../middlewares/role.middleware.js";

const router = express.Router();

/**
 * 🔓 Public Routes
 */
router.post("/register", createUser); // Usually Admin-only (via frontend UI)
router.post("/login", loginUser); // Login

/**
 * 🔐 Authenticated Routes
 */
router.post("/logout", verifyJWT, logoutUser); // Logout
router.post("/refresh", verifyJWT, refreshAccessToken); // Refresh token
router.get("/current-user", verifyJWT, getCurrentUser); // Current user info
router.patch("/update-account", verifyJWT, updateAccountDetails); // Update user info

/**
 * 👑 Admin Routes
 */
router.get("/", verifyJWT, checkRole(["admin"]), getUsers); // View all users

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
  checkRole(["receptionist"]),
  receptionistBookAppointment
);
router.patch(
  "/receptionist/checkin/:patientId",
  verifyJWT,
  checkRole(["receptionist"]),
  receptionistCheckInPatient
);

export default router;
