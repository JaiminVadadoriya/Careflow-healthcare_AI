// models/MedicalRecord.js
import mongoose from 'mongoose';

const MedicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date_time: { type: Date, default: Date.now },
  diagnosis: { type: String, required: true },
  treatment: { type: String, required: true },
  lab_results: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LabTestResult' }]
}, { timestamps: true });

export default mongoose.model('MedicalRecord', MedicalRecordSchema);
