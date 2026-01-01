import User from "../models/user.model.js";
import Appointment from "../models/appointment.model.js";
import Inventory from "../models/inventory.model.js";
import Bed from "../models/bed.model.js";

class AdminService {
  async getDashboardStats() {
    const [userCount, appointmentCount, inventoryCount, bedCount] = await Promise.all([
      User.countDocuments(),
      Appointment.countDocuments(),
      Inventory.countDocuments(),
      Bed.countDocuments({ is_occupied: true }),
    ]);

    return {
      totalUsers: userCount,
      totalAppointments: appointmentCount,
      totalInventoryItems: inventoryCount,
      occupiedBeds: bedCount,
      recentActivity: [
        { type: "user", text: `${userCount} total users`, time: new Date() },
        { type: "appointment", text: `${appointmentCount} total appointments`, time: new Date() },
        { type: "inventory", text: `${inventoryCount} inventory items`, time: new Date() },
        { type: "bed", text: `${bedCount} beds occupied`, time: new Date() },
      ],
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
}

export default new AdminService();
