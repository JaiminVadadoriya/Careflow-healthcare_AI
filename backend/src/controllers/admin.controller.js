import AdminService from "../services/admin.service.js";
import ApiResponse from "../utils/api_response.utils.js";
import { asyncHandler } from "../utils/async_handler.utils.js";

class AdminController {
  getDashboardReports = asyncHandler(async (req, res) => {
    const data = await AdminService.getDashboardStats();
    return res.status(200).json(new ApiResponse(200, "Dashboard reports retrieved successfully", data));
  });

  getUserReports = asyncHandler(async (req, res) => {
    const { startDate, endDate, role } = req.query;
    const data = await AdminService.getUserReports({ startDate, endDate, role });
    return res.status(200).json(new ApiResponse(200, "User reports retrieved successfully", data));
  });

  getAppointmentReports = asyncHandler(async (req, res) => {
    const { startDate, endDate, status } = req.query;
    const data = await AdminService.getAppointmentReports({ startDate, endDate, status });
    return res.status(200).json(new ApiResponse(200, "Appointment reports retrieved successfully", data));
  });

  getInventoryReports = asyncHandler(async (req, res) => {
    const { type, lowStock } = req.query;
    const data = await AdminService.getInventoryReports({ type, lowStock });
    return res.status(200).json(new ApiResponse(200, "Inventory reports retrieved successfully", data));
  });
}

export default new AdminController();
