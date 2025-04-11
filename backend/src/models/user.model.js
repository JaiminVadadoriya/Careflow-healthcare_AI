import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'nurse', 'receptionist', 'inventory'],
    required: true
  },
  phone: String,
  profile_photo: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);  // Use export default
