import express from 'express';
import {
    addPatient,
    getAppointments,
    getCurrentUser,
    getLabResults,
    getMedicalRecordById,
    getMedicalRecords,
    getPatientData,
    getPatients,
    loginPatient,
    postAppointments,
    registerPatient,
    updateAccountDetails,
    updateMedicalRecordById,
    updatePatientData
} from '../controllers/patient.controller.js';

import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

/* 🔓 Public Routes */
router.post('/register', registerPatient);         // Register a new patient
router.post('/login', loginPatient);               // Patient login
router.post('/', addPatient);                      // (Optional admin use) Add patient directly

// Receptionist/Doctor/Patient can view patients
router.get('/', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['receptionist', 'doctor', 'admin']), getPatients);
router.get('/:patientId', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['receptionist', 'doctor', 'admin', 'patient']), getPatientData);
router.patch('/:patientId', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['receptionist', 'doctor', 'admin', 'patient']), updatePatientData);

/* 🔒 Protected Routes (Patient Auth Required) */
router.use(AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['patient', 'doctor']));

router.get('/profile', getCurrentUser);            // Get current user's profile
router.patch('/update-account', updateAccountDetails); // Update account details

/* 🗓️ Appointments */
router.get('/appointments', getAppointments);      // View appointments
router.post('/appointments', postAppointments);    // Book appointment

/* 🧍 Patient Data */
// Already handled above

/* 🧪 Lab Results */
router.get('/lab-results', getLabResults);         // View lab results

/* 📋 Medical Records */
router.get('/medical-records', getMedicalRecords);             // Get all medical records
router.get('/medical-records/:recordId', getMedicalRecordById); // Get specific record
router.patch('/medical-records/:recordId', updateMedicalRecordById); // Update record

export default router;
