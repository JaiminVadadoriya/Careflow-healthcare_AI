import express from 'express';
import {
    assignPatientToBed,
    getAllBeds,
    getAvailableBeds,
    updateBedStatus
} from '../controllers/bed.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', AuthMiddleware.authenticate, getAllBeds);
router.get('/available', AuthMiddleware.authenticate, getAvailableBeds);
router.patch('/:bedId/assign', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['admin', 'nurse']), assignPatientToBed);
router.patch('/:bedId/status', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['admin']), updateBedStatus);

export default router;
