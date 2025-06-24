import express from 'express';
import {
    createMedicalRecord,
    getMedicalRecordById,
    getMedicalRecordsByPatient,
    updateMedicalRecord
} from '../controllers/medicalRecord.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import checkRole from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', verifyJWT, checkRole(['doctor']), createMedicalRecord); // Doctor creates record
router.get('/patient/:patientId', verifyJWT, checkRole(['doctor', 'patient']), getMedicalRecordsByPatient); // View patient history
router.get('/:recordId', verifyJWT, checkRole(['doctor', 'patient']), getMedicalRecordById);
router.patch('/:recordId', verifyJWT, checkRole(['doctor']), updateMedicalRecord); // Doctor updates treatment

export default router;
