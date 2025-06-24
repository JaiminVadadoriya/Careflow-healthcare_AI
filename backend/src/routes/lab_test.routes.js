import express from 'express';
import {
    createLabTestResult,
    getLabResultsByPatient,
    getLabTestById,
    updateLabTestStatus
} from '../controllers/labTest.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import checkRole from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', verifyJWT, checkRole(['lab', 'doctor']), createLabTestResult);
router.get('/patient/:patientId', verifyJWT, checkRole(['doctor', 'patient']), getLabResultsByPatient);
router.get('/:testId', verifyJWT, checkRole(['doctor', 'patient']), getLabTestById);
router.patch('/:testId/status', verifyJWT, checkRole(['lab']), updateLabTestStatus);

export default router;
