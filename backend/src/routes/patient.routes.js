import express from 'express';
import { addPatient, getPatients, loginPatient } from '../controllers/patient.controller.js'; // ES Module imports
const router = express.Router();

// Define routes
router.post('/', addPatient);  // Add new patient
router.get('/', getPatients);  // Get all patients
router.post('/login', loginPatient);

// Export the router
export default router;  // Use ES Module export
