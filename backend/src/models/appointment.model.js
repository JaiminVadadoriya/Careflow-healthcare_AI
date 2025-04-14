// models/Appointment.js
import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date_time: { type: Date, required: [true, 'Date and time for the appointment is required'] },
    reason: {
      type: String,
      required: [true, 'Reason for the appointment is required'],
      minlength: [5, 'Reason must be at least 5 characters long']
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', AppointmentSchema);
