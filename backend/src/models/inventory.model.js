// models/Inventory.js
import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['medicine', 'equipment', 'consumable'],
      required: true
    },
    category: { type: String }, // e.g. "Antibiotics", "Surgical"
    quantity_available: { type: Number, default: 0 },
    minimum_required: { type: Number, default: 0 },
    unit_price: { type: Number, default: 0 },
    expiry_date: Date,
    supplier_info: {
      name: { type: String },
      contact: { type: String },
      email: { type: String }
    },
    status: {
        type: String,
        enum: ['active', 'low_stock', 'out_of_stock', 'expired', 'discontinued'],
        default: 'active'
    },
    transactions: [
        {
            type: { type: String, enum: ['IN', 'OUT', 'ADJUSTMENT'], required: true },
            quantity: { type: Number, required: true },
            performed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            date: { type: Date, default: Date.now },
            reason: { type: String }
        }
    ]
  },
  { timestamps: true }
);

// Pre-save hook to update status based on quantity
InventorySchema.pre('save', function(next) {
    if (this.quantity_available <= 0) {
        this.status = 'out_of_stock';
    } else if (this.quantity_available <= this.minimum_required) {
        this.status = 'low_stock';
    } else if (this.expiry_date && new Date(this.expiry_date) < new Date()) {
        this.status = 'expired';
    } else if (this.status !== 'discontinued') { // Start/remain active if not manually discontinued
        this.status = 'active';
    }
    next();
});

export default mongoose.model('Inventory', InventorySchema);
