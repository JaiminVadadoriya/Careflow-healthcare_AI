import User from "../models/user.model.js";
import Appointment from "../models/appointment.model.js";
import Inventory from "../models/inventory.model.js";
import Bed from "../models/bed.model.js";
import Patient from "../models/patient.model.js";
import AuditLog from "../models/audit_log.model.js";
import Setting from "../models/setting.model.js";

class AdminService {
  async getDashboardStats() {
    // Occupied beds = Admitted Patients (admitted, icu, isolation)
    const [userCount, appointmentCount, inventoryCount, occupiedBedsCount] = await Promise.all([
      User.countDocuments(),
      Appointment.countDocuments(),
      Inventory.countDocuments(),
      Patient.countDocuments({ current_status: { $in: ['admitted', 'icu', 'isolation'] } }),
    ]);

    // Fetch real recent activity
    const recentActivity = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('performed_by', 'full_name');

    return {
      totalUsers: userCount,
      totalAppointments: appointmentCount,
      totalInventoryItems: inventoryCount,
      occupiedBeds: occupiedBedsCount,
      recentActivity: recentActivity.map(log => ({
        text: `${log.action} by ${log.performed_by?.full_name || 'System'}`,
        time: log.createdAt,
        type: 'log'
      })) 
    };
  }

  async getUserReports({ startDate, endDate, role }) {
    let query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select("-password -refreshToken");
    const roleStats = await User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]);

    return {
      users,
      totalUsers: users.length,
      roleDistribution: roleStats,
      dateRange: { startDate, endDate },
    };
  }

  async getAppointmentReports({ startDate, endDate, status }) {
    let query = {};
    if (startDate && endDate) {
      query.date_time = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "full_name")
      .populate("doctor", "full_name");

    const statusStats = await Appointment.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

    return {
      appointments,
      totalAppointments: appointments.length,
      statusDistribution: statusStats,
      dateRange: { startDate, endDate },
    };
  }

  async getInventoryReports({ type, lowStock }) {
    let query = {};
    if (type) {
      query.type = type;
    }
    if (lowStock === "true") {
      query.$expr = { $lt: ["$quantity_available", "$minimum_required"] };
    }

    const inventory = await Inventory.find(query);
    const typeStats = await Inventory.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]);

    const lowStockItems = await Inventory.find({
      $expr: { $lt: ["$quantity_available", "$minimum_required"] },
    });

    return {
      inventory,
      totalItems: inventory.length,
      typeDistribution: typeStats,
      lowStockItems: lowStockItems.length,
      lowStockItemsList: lowStockItems,
    };
  }
  // Audit Logs
  async logAction({ action, performedBy, targetResource, details }) {
      return await AuditLog.create({
          action,
          performed_by: performedBy,
          target_resource: targetResource,
          details
      });
  }

  async getActivityLogs(limit = 20) {
      return await AuditLog.find()
          .sort({ createdAt: -1 })
          .limit(limit)
          .populate('performed_by', 'full_name email role');
  }

  // Settings Management
  async getSettings() {
      return await Setting.find();
  }

  async updateSetting(key, value) {
      return await Setting.findOneAndUpdate(
          { key },
          { value },
          { new: true, upsert: true } // Create if not exists
      );
  }

  // User Management extended
  async getAllUsers() {
      return await User.find().select("-password");
  }

  async updateUserRole(userId, newRole) {
      return await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
  }

  async updateUserStatus(userId, status) {
      return await User.findByIdAndUpdate(userId, { status }, { new: true });
  }
}

export default new AdminService();
