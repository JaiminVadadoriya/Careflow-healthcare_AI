import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true }, // e.g., 'hospital_name'
    value: { type: mongoose.Schema.Types.Mixed, required: true }, // Can be string, boolean, number, or object
    description: { type: String, required: false },
    group: { type: String, default: 'general' }, // e.g., 'general', 'billing', 'notifications'
    is_public: { type: Boolean, default: false } // If true, accessible without auth (e.g., login page title)
  },
  { timestamps: true }
);

export default mongoose.model('Setting', SettingSchema);
