// routes/user.routes.js
import express from 'express';
import { createUser, getUsers } from '../controllers/user.controller.js'; // ES module import

const router = express.Router();

router.post('/', createUser);  // Create user (Admin)
router.get('/', getUsers);     // Get all users (Admin)

export default router;  // Use ES module export
