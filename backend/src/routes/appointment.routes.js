import express from 'express';
import { bookAppointment, getAppointments } from '../controllers/appointment.controller.js'; // Use `import` for ES module
const router = express.Router();

// Define routes
router.post('/', bookAppointment);  // POST route for booking an appointment
router.get('/', getAppointments);   // GET route for retrieving all appointments

export default router;  // Export the router as an ES module
