const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date_time: Date,
  diagnosis: String,
  treatment: String,
  lab_results: Object
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);
