import express from 'express';
import {
    addInventoryItem,
    deleteInventoryItem,
    getInventoryItem,
    getInventoryList,
    updateInventoryItem
} from '../controllers/inventory.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['admin']), addInventoryItem);
router.get('/', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['admin', 'doctor']), getInventoryList);
router.get('/:itemId', AuthMiddleware.authenticate, getInventoryItem);
router.patch('/:itemId', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['admin']), updateInventoryItem);
router.delete('/:itemId', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['admin']), deleteInventoryItem);

export default router;
