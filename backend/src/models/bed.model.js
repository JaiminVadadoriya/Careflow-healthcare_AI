const mongoose = require('mongoose');

const BedSchema = new mongoose.Schema({
  room_number: String,
  ward: { type: String, enum: ['general', 'icu', 'isolation'] },
  bed_type: { type: String, enum: ['standard', 'icu', 'isolation'] },
  is_occupied: { type: Boolean, default: false },
  assigned_patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Bed', BedSchema);
