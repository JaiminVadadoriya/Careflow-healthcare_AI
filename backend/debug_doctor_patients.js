import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Patient from './src/models/patient.model.js';
import User from './src/models/user.model.js';

dotenv.config({ path: './.env' });

const debugDoctor = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/CareFlow`);
        console.log("Connected to DB");

        const doctorId = "695672bce1211a2d0d7aa052"; // ID from user provided JSON
        console.log("Debugging for Doctor ID:", doctorId);

        // 1. Verify Doctor Exists
        const doctor = await User.findById(doctorId);
        if (!doctor) {
            console.log("❌ Doctor NOT FOUND in Users collection!");
        } else {
            console.log("✅ Doctor Found:", doctor.full_name, doctor.role);
        }

        // 2. Query Patients with string ID
        console.log("\nQuerying with String ID...");
        const patientsString = await Patient.find({ assigned_doctor: doctorId });
        console.log(`Found ${patientsString.length} patients.`);
        patientsString.forEach(p => console.log(` - ${p.full_name} (${p.current_status}) -> Assigned: ${p.assigned_doctor}`));

        // 3. Query Patients with ObjectId
        console.log("\nQuerying with ObjectId...");
        const patientsObject = await Patient.find({ assigned_doctor: new mongoose.Types.ObjectId(doctorId) });
        console.log(`Found ${patientsObject.length} patients.`);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

debugDoctor();
