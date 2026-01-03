import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware.js";
import AdminController from "../controllers/admin.controller.js";

const router = Router();

// Global Admin Guard
router.use(AuthMiddleware.authenticate);
router.use(AuthMiddleware.restrictTo(["admin"]));

// Reports
router.get("/reports/dashboard", AdminController.getDashboardReports);
router.get("/reports/users", AdminController.getUserReports);
router.get("/reports/appointments", AdminController.getAppointmentReports);
router.get("/reports/inventory", AdminController.getInventoryReports);

// Logs & Activity
router.get("/activity-logs", AdminController.getActivityLogs);

// Settings
router.get("/settings", AdminController.getSettings);
router.post("/settings", AdminController.updateSetting);

// User Management (Direct)
router.get("/users", AdminController.getAllUsers);
router.patch("/users/:id/role", AdminController.updateUserRole);
router.patch("/users/:id/status", AdminController.updateUserStatus);

export default router;
