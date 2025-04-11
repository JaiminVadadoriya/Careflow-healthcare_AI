const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['medicine', 'equipment'], required: true },
  quantity_available: Number,
  minimum_required: Number,
  expiry_date: Date,
  supplier_info: {
    name: String,
    contact: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', InventorySchema);
