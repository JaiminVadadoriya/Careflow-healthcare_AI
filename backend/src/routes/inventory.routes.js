import express from 'express';
import {
    addInventoryItem,
    getInventoryItem,
    getInventoryList,
    updateInventoryItem
} from '../controllers/inventory.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import checkRole from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', verifyJWT, checkRole(['admin']), addInventoryItem);
router.get('/', verifyJWT, checkRole(['admin', 'doctor']), getInventoryList);
router.get('/:itemId', verifyJWT, getInventoryItem);
router.patch('/:itemId', verifyJWT, checkRole(['admin']), updateInventoryItem);

export default router;
