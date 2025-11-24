import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import {
  generateKeyForProject,
  getKeys,
  revokeKey,
} from '../controllers/keyController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post(
  '/generate',
  [
    body('projectId').notEmpty().withMessage('Project ID is required'),
    body('prefix').optional().isIn(['live', 'test']),
  ],
  generateKeyForProject
);

router.get('/', getKeys);
router.delete('/:id', revokeKey);

export default router;

