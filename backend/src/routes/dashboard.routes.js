import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import DashboardController from "../controllers/dashboard.controller.js";

const router = Router();

// Apply Global Auth
router.use(AuthMiddleware.authenticate);

// Admin Routes
router.get("/admin", AuthMiddleware.restrictTo(["admin"]), DashboardController.getAdminStats);

// Doctor Routes
router.get("/doctor", AuthMiddleware.restrictTo(["doctor", "admin"]), DashboardController.getDoctorStats);

// Nurse Routes
router.get("/nurse", AuthMiddleware.restrictTo(["nurse", "admin"]), DashboardController.getNurseStats);

// Receptionist Routes
router.get("/receptionist", AuthMiddleware.restrictTo(["receptionist", "admin"]), DashboardController.getReceptionistStats);

export default router;
