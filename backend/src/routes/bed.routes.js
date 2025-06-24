import express from 'express';
import {
    assignPatientToBed,
    getAllBeds,
    getAvailableBeds,
    updateBedStatus
} from '../controllers/bed.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import checkRole from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', verifyJWT, getAllBeds);
router.get('/available', verifyJWT, getAvailableBeds);
router.patch('/:bedId/assign', verifyJWT, checkRole(['admin', 'nurse']), assignPatientToBed);
router.patch('/:bedId/status', verifyJWT, checkRole(['admin']), updateBedStatus);

export default router;
