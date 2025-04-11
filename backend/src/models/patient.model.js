import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  dob: { type: Date, required: true },  // Date of birth (required)
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  contact_info: {
    phone: { type: String, required: true, match: [/^\d{10}$/, 'Please provide a valid phone number'] },
    address: { type: String, required: true },
    email: { type: String, match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'] }
  },
  emergency_contact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relation: { type: String, required: true }
  },
  admission_date: { type: Date, default: Date.now },  // Default to current date if not provided
  discharge_date: { type: Date },
  current_status: {
    type: String,
    enum: ['admitted', 'discharged', 'icu', 'isolation'],
    default: 'admitted'
  },
  assigned_doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Ensure that doctor is required
  medical_history: { type: [String], required: true },
  password: { type: String, required: true, minlength: 6 },  // Password field (hashed, required, and minimum length)
}, { timestamps: true });

// Ensure to populate `assigned_doctor` when querying
PatientSchema.methods.populateDoctor = function() {
  return this.populate('assigned_doctor');
};

// Export the Patient model as an ES module
export default mongoose.model('Patient', PatientSchema);
