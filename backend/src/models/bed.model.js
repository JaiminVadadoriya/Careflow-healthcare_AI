// models/Bed.js
import mongoose from 'mongoose';

const BedSchema = new mongoose.Schema(
  {
    room_number: { type: String, required: true },
    ward: {
      type: String,
      enum: ['general', 'icu', 'isolation'],
      required: true
    },
    bed_type: {
      type: String,
      enum: ['standard', 'icu', 'isolation'],
      required: true
    },
    is_occupied: { type: Boolean, default: false },
    assigned_patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model('Bed', BedSchema);
