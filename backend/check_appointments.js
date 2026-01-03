import mongoose from 'mongoose';
import Appointment from './src/models/appointment.model.js';
import dotenv from 'dotenv';

dotenv.config();

const checkAppointments = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const appointments = await Appointment.find({});
    console.log(`Found ${appointments.length} appointments.`);
    
    appointments.forEach(a => {
        console.log(`ID: ${a._id}, Status: ${a.status}, Doctor: ${a.doctor}, Patient: ${a.patient}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAppointments();
