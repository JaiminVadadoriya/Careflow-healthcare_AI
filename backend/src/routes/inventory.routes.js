import express from 'express';
import {
    addInventoryItem,
    deleteInventoryItem,
    getInventoryItem,
    getInventoryList,
    updateInventoryItem,
    consumeStock,
    getLowStockItems
} from '../controllers/inventory.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['admin', 'inventory']), addInventoryItem);
router.get('/', AuthMiddleware.authenticate, getInventoryList); // All roles can view? Or restrict? Let's allow all for now
router.get('/low-stock', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['admin', 'inventory', 'nurse', 'doctor']), getLowStockItems);
router.get('/:itemId', AuthMiddleware.authenticate, getInventoryItem);
router.post('/consume/:itemId', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['admin', 'doctor', 'nurse', 'inventory']), consumeStock);
router.patch('/:itemId', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['admin', 'inventory']), updateInventoryItem);
router.delete('/:itemId', AuthMiddleware.authenticate, AuthMiddleware.restrictTo(['admin']), deleteInventoryItem);

export default router;
