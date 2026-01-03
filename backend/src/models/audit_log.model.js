import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g., 'USER_CREATED', 'INVENTORY_CONSUMED'
    performed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    target_resource: { type: String, required: false }, // e.g., 'User: 12345'
    details: { type: Object, required: false }, // Flexible JSON for diffs or extra info
    ip_address: { type: String, required: false }
  },
  { timestamps: { createdAt: true, updatedAt: false } } // Logs are immutable
);

export default mongoose.model('AuditLog', AuditLogSchema);
