import express from 'express';
import { validateKey } from '../controllers/validateController.js';

const router = express.Router();

// Public endpoint - no authentication required
router.post('/', validateKey);

export default router;

