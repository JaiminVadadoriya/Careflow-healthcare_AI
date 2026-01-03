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
  getActivityLogs = asyncHandler(async (req, res) => {
    const logs = await AdminService.getActivityLogs();
    return res.status(200).json(new ApiResponse(200, "Activity logs retrieved", logs));
  });

  getSettings = asyncHandler(async (req, res) => {
    const settings = await AdminService.getSettings();
    return res.status(200).json(new ApiResponse(200, "System settings retrieved", settings));
  });

  updateSetting = asyncHandler(async (req, res) => {
    const { key, value } = req.body;
    const setting = await AdminService.updateSetting(key, value);
    // Log this action
    await AdminService.logAction({
        action: 'UPDATE_SETTING',
        performedBy: req.user._id,
        targetResource: key,
        details: { newValue: value }
    });
    return res.status(200).json(new ApiResponse(200, "Setting updated", setting));
  });
  
  getAllUsers = asyncHandler(async (req, res) => {
      const users = await AdminService.getAllUsers();
      return res.status(200).json(new ApiResponse(200, "All users retrieved", users));
  });

  updateUserRole = asyncHandler(async (req, res) => {
      const { role } = req.body;
      const user = await AdminService.updateUserRole(req.params.id, role);
      await AdminService.logAction({
        action: 'UPDATE_USER_ROLE',
        performedBy: req.user._id,
        targetResource: `User: ${user.email}`,
        details: { newRole: role }
    });
      return res.status(200).json(new ApiResponse(200, "User role updated", user));
  });

  updateUserStatus = asyncHandler(async (req, res) => {
      const { status } = req.body; // 'active' or 'inactive'
      const user = await AdminService.updateUserStatus(req.params.id, status);
      await AdminService.logAction({
        action: 'UPDATE_USER_STATUS',
        performedBy: req.user._id,
        targetResource: `User: ${user.email}`,
        details: { newStatus: status }
    });
      return res.status(200).json(new ApiResponse(200, "User status updated", user));
  });
}

export default new AdminController();
