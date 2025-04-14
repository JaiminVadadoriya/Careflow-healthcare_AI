// models/Inventory.js
import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['medicine', 'equipment'],
      required: true
    },
    quantity_available: { type: Number, default: 0 },
    minimum_required: { type: Number, default: 0 },
    expiry_date: Date,
    supplier_info: {
      name: { type: String },
      contact: { type: String }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Inventory', InventorySchema);
